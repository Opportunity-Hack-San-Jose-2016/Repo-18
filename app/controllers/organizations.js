'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');

function doCreateOrUpdate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, ["_id", "services", "locations", "contactPerson", 'number']);
    form.lastModify = new Date();
    form.services = util.asArray(form.services);
    form.services.sort();
    form.locations = util.asArray(form.locations);
    form.locations.sort();
    log.v('form is ', form);

    if (form._id) {
        return mongo.get({
            _id: form._id,
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
}

exports.create = function (req, res) {
    doCreateOrUpdate(req).then(function (result) {
        ERROR.render(res, '');
    });
};

exports.createApi = function (req, res) {
    doCreateOrUpdate(req).then(function (result) {
        ERROR.ok(res, result);
    });
};

function doList(req) {
    log.req(req);
    var form = util.copy(req.body, ["_id", "services", "locations", "contactPerson", 'number']);
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

function doSearch(req) {
    
}

exports.searchNearby = function (req, res) {

};

function _calculateAge(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

