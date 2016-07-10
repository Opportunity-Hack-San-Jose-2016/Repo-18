'use strict';
var util = require('../utils/util');

var ERROR = {
    INVALID_ERROR: {code: -1, msg: 'this error should be fixed'},
    OK: {code: 0, msg: 'request is accepted'},

    INVALID_USER_NAME: {code: 101, msg: 'User name is invalid'},
    INVALID_PASSWORD: {code: 102, msg: 'Password is invalid'},
    INVALID_EMAIL: {code: 103, msg: 'Email is invalid'},
    INVALID_FULL_NAME: {code: 104, msg: 'Full name is invalid'},
    DUP_USER_NAME: {code: 105, msg: 'User name has been used'},
    DUP_EMAIL: {code: 106, msg: 'This email has been used'},
    INVALID_EMAIL_OR_PASSWORD: {code: 201, msg: 'Email or password is incorrect'},
    LOGIN_IS_REQUIRED: {code: 202, msg: 'Login is required'},
    INVALID_TOKEN: {code: 202, msg: 'Invalid token'},
    INVALID_BIRTHDAY: {code: 203, msg: 'Invalid birthday'},
    INVALID_MOBILE: {code: 204, msg: 'Invalid mobile phone'},
    INVALID_LOCATION: {code: 205, msg: 'Invalid location'},
    PERMISSION_DENIED: {code: 206, msg: 'Permission denied'},
    INVALID_USER_ID: {code: 207, msg: 'Invalid user id'},
    INVALID_PARAM: {code: 209, msg: 'Invalid Parameter: '},
    PARAM_REQUIRED: {code: 210, msg: 'Parameter(s) required: '},
    AUTH_REQUIRED: {code: 211, msg: 'Authentication is required'},
    OPERATION_NOT_PROVIDE: {code: 217, msg: 'Operation is not provided'},
};

var errorIndex = (function () {
    var index = {};
    for (var name in ERROR) {
        var error = ERROR[name];
        index[error.code] = name;
    }
    return index;
})();

ERROR.invalidParam = function (param) {
    var err = util.copy(ERROR.INVALID_PARAM);
    err.msg += param;
    return err;
};

ERROR.paramRequired = function (param) {
    var err = util.copy(ERROR.PARAM_REQUIRED);
    err.msg += param;
    return err;
};

ERROR.of = function (errorCode) {
    var name = errorIndex[errorCode];
    var error = ERROR[name];
    if (!error) {
        error = ERROR.INVALID_EMAIL;
    }
    return error;
};

ERROR.systemError = function (res, err) {
    res.status(500);
    res.send(err);
};

ERROR.badRequest = function (res, err) {
    res.status(400);
    res.send(err);
};

ERROR.ok = function (res, result) {
    res.status(200);
    res.send(result);
};

ERROR.render = function (res, page) {
    res.render(page);
};

ERROR.showErrorMsg = function (res, err) {
    res.render('errorInfo.jade', {err: err});
};
module.exports = ERROR;