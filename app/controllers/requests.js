'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const mongo = require('../utils/mongo-util');

function doCreate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, {unid: 1, poleCode: 1, requestType: 1, state: 1, phoneNum: 1});
    form.date = new Date();
    if (form.unid) {
        form.unid = form.unid.toLowerCase().trim();
    }
    log.v('form is ', form);
    return mongo.get({
        unid: form.unid,
        state: CONST.REQ_STATE_WAITING
    }, CONST.COLLECTION_REQUEST).spread(function (request) {
        if (request) {
            form._id = request._id;
        }
        return mongo.put(form, CONST.COLLECTION_REQUEST);
    });
}

exports.create = function (req, res) {
    doCreate(req).then(function (result) {
        res.render('');
    });
};

exports.createApi = function (req, res) {
    doCreate(req).then(function (result) {
        res.send(result);
    });
};

function doList(req) {
    log.req(req);
    var form = util.copy(req.body, {unid: 1, date: 1, poleCode: 1, requestType: 1, state: 1, phoneNum: 1});
    var where = mongo.toFilter(form);
    return mongo.get(where, CONST.COLLECTION_REQUEST);
}

exports.listApi = function (req, res) {
    doList(req).then(function (result) {
        res.send(result);
    });
};