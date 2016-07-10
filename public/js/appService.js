/**
 * Created by Martin on 4/20/2016.
 */
var app = require('./app.js');
var api_path = "/v1";
'use strict';
app.factory('AppService',['$http',function($http){
    this.user = null;
    this.truck =null;
    return {
        user:this.user,
        truck:this.truck
    };
}]);
app.factory('DriverService',['$http',function($http){
    return {
        queryDrivers: function (data, cb) {
            $http({method: 'GET', url: api_path+'/driver/drivers',data:data}).
            success(function (data,status) {
                cb(data,status);
            }).
            error(function (data,status) {
                cb(data,status);
            });
        }
        , login: function (user, cb) {
            var b = new Base64();
            user.password = b.encode(user.password);
            $http({method: 'POST', url: '/postDoLogin',data:user}).
            success(function (data, status) {
                cb(data,status);
            }).
            error(function (data, status) {
                cb(data,status);
            });
        }
    };
}]);
app.factory('TruckService',['$http',function($http){
    return {
        queryTrucks: function (data, cb) {
            $http({method: 'GET', url: api_path+'/truck/trucks',data:data}).
            success(function (data,status) {
                cb(data,status);
            }).
            error(function (data,status) {
                cb(data,status);
            });
        }
    };
}]);