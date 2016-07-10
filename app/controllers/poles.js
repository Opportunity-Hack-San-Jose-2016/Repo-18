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
    var form = util.copy(req.body, {poleCode: 1, lat: 1, long: 1, state: 1});
    form.date = new Date();
    if (form.poleCode) {
        form.poleCode = form.poleCode.toLowerCase().trim();
    }
    log.v('form is ', form);

    return mongo.get({
        poleCode: form.poleCode
    }, CONST.COLLECTION_POLE).spread(function (pole) {
        if (!pole) {
            return Promise.rejected(ERROR.invalidParam('poleCode'));
        }
        form._id = pole._id;
        return mongo.put(form, CONST.COLLECTION_POLE);
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
