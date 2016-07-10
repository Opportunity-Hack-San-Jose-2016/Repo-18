'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');

function doCreateOrUpdate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, {unid: 1, poleCode: 1, requestType: 1, state: 1, phoneNum: 1});
    form.date = new Date();
    if (form.unid) {
        form.unid = form.unid.toLowerCase().trim();
    } else {
        return Promise.reject(ERROR.invalidParam('unid'));
    }
    form.state = form.state || CONST.REQ_STATE_WAITING;
    log.v('form is ', form);
    return mongo.get({
        unid: form.unid,
        state: CONST.REQ_STATE_WAITING
    }, CONST.COLLECTION_REQUEST).spread(function (request) {
        if (request) {
            util.setProperties(request, form);
            form = request;
        }
        return mongo.put(form, CONST.COLLECTION_REQUEST);
    }).bind({}).then(function (request) {
        this.request = request;
        return mongo.get({poleCode: form.poleCode}, CONST.COLLECTION_POLE);
    }).spread(function (pole) {
        if (form.state === CONST.REQ_STATE_WAITING) {
            pole.requests = pole.requests ? pole.requests + 1 : 1;
        } else {
            pole.requests = pole.requests ? pole.requests - 1 : 0;
        }
        return mongo.put(pole, CONST.COLLECTION_POLE);
    }).then(function () {
        return this.request;
    });
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
    var form = util.copy(req.body, {unid: 1, date: 1, poleCode: 1, requestType: 1, state: 1, phoneNum: 1});
    var where = mongo.toFilter(form);

    return mongo.collection(CONST.COLLECTION_REQUEST).then(function (collection) {
        var query = collection.find(where).sort({date: -1});
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