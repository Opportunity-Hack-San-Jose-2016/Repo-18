'use strict';

'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');

function doCreate(req) {
    log.req(req);
    // generate pole code here
}

function doUpdate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, ["poleCode", "lat", "long", "state", "address", "placeName"]);
    form.date = new Date();
    if (form.poleCode) {
        form.poleCode = form.poleCode.toLowerCase().trim();
    }
    log.v('form is ', form);

    return mongo.get({
        poleCode: form.poleCode
    }, CONST.COLLECTION_POLE).spread(function (pole) {
        if (!pole) {
            // return Promise.rejected(ERROR.invalidParam('poleCode'));
            pole = {};
        }
        util.setProperties(pole, form);
        return mongo.put(pole, CONST.COLLECTION_POLE);
    });
}

exports.update = function (req, res) {
    doUpdate(req).then(function (result) {
        ERROR.render(res, '');
    }).catch(function (err) {
        throw 'fix me';
    });
};

exports.updateApi = function (req, res) {
    doUpdate(req).then(function (result) {
        ERROR.ok(res, result);
    }).catch(function (err) {
        ERROR.badRequest(res, err);
    });
};


function doList(req) {
    log.req(req);
    var form = util.copy(req.body, ["poleCode", "lat", "long", "state", "address", "placeName", "requests"]);
    log.v('form = ', form);
    var where = mongo.toFilter(form);

    return mongo.collection(CONST.COLLECTION_POLE).then(function (collection) {
        var query = collection.find(where).sort({requests: -1});
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
        log.v('result = ', result);
        ERROR.ok(res, result);
    });
};
