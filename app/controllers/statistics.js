'use strict';

'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');

function getTrending() {
    var trending = {};
    return mongo.get({state: CONST.REQ_STATE_WAITING}, CONST.COLLECTION_REQUEST).then(function (reqests) {
        trending.new = reqests.length;
        return mongo.get({state: CONST.REQ_STATE_ONGOING}, CONST.COLLECTION_REQUEST);
    }).then(function (requests) {
        trending.ongoing = requests.length;
        var startTime = new Date() - 7 * 24 * 60 * 60 * 1000;// one week ago
        return mongo.get({
            state: CONST.REQ_STATE_COMPLETED,
            date: {$gt: new Date(startTime)}
        }, CONST.COLLECTION_REQUEST);
    }).then(function (requests) {
        trending.done = requests.length;
        log.v('trending = ', trending);
        return trending;
    });
}

exports.getSummary = function (req, res) {
    getTrending().then(function (trending) {
        ERROR.ok(res, trending);
    });
};
