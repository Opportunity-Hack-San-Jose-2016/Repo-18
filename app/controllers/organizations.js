'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');
const NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder(options);
var Promise = require('bluebird');

var options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyAsEgMf-7pMCY4ZnLyAYgX1nNL-7h0k23E', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

function doCreateOrUpdate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, ["_id", 'name', "services", "locations", "contactPerson", 'number']);
    form.lastModify = new Date();
    form.services = util.asArray(form.services);
    form.services.sort();
    if (typeof  form.locations == typeof '') {
        form.locations = form.locations.match(/[^\r\n]+/g);
    }
    form.locations = util.asArray(form.locations);
    var locationDetails = [];
    return Promise.each(form.locations, function (location) {
        if (!location || !location.trim()) {
            return Promise.resolve();
        }
        return geocoder.geocode(location).spread(function (info) {
            log.v('info = ', info);
            info = info || {};
            var o = {};
            o.lat = info.latitude;
            o.lng = info.longitude;
            o.country = info.country;
            o.city = info.city;
            o.address = location;
            locationDetails.push(o);
        });
    }).then(function () {
        log.v('locationDetails = ', locationDetails);
        form.locations = locationDetails;
    }).then(function () {
        log.v('form is ', form);
        if (form._id) {
            return mongo.get({
                _id: form._id
            }, CONST.COLLECTION_ORGANIZATION).spread(function (request) {
                if (request) {
                    util.setProperties(request, form);
                    form = request;
                }
                return mongo.put(form, CONST.COLLECTION_ORGANIZATION);
            });
        } else {
            return mongo.put(form, CONST.COLLECTION_ORGANIZATION);
        }
    });
}

exports.create = function (req, res) {
    doCreateOrUpdate(req).then(function (result) {
        req.flash.info = 'Organization Added';
        res.redirect('/organization');
    });
};

exports.createApi = function (req, res) {
    doCreateOrUpdate(req).then(function (result) {
        ERROR.ok(res, result);
    });
};

function doList(req) {
    log.req(req);
    var form = util.copy(req.body, ["_id", 'name', "services", "locations", "contactPerson", 'number']);
    var where = mongo.toFilter(form);
    log.v('where = ', where);

    return mongo.collection(CONST.COLLECTION_ORGANIZATION).then(function (collection) {
        var query = collection.find(where).sort({_id: 1});
        if (req.query.page) {
            const skip = CONST.PAGE_SIZE * (req.query.page - 1);
            query = query.skip(skip).limit(CONST.PAGE_SIZE);
        }
        query = query.toArrayAsync();
        return query;
    });
}

exports.listApi = function (req, res) {
    doList(req).then(function (result) {
        ERROR.ok(res, result);
    });
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function doSearch(req) {
    log.req(req);
    var user = req.body;
    return mongo.get({}, CONST.COLLECTION_ORGANIZATION).then(function (organizations) {
        var available = [];
        organizations.forEach(function (organization) {
            if (organization.locations) {
                log.v('organization = ', organization);
                organization.locations.forEach(function (location) {
                    log.v('location = ', location);
                    if (location && location.lat && location.lng) {
                        var distance = getDistanceFromLatLonInKm(user.lat, user.lng, location.lat, location.lng);
                        log.v('distance = ', distance);
                        if (distance < CONST.MAX_SEARCHING_RANGE) {
                            organization.location = location;
                            organization.distance = distance;
                            available.push(organization)
                        }
                    }
                })
            }
        });
        available.sort(function (a, b) {
            return a.distance - b.distance;
        });
        return available;
    })
}

exports.searchNearbyApi = function (req, res) {
    doSearch(req).then(function (organizations) {
        ERROR.ok(res, organizations);
    });
};

function _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

