/**
 * Created by Crystal on 7/10/16.
 */
var pos;
refugee.controller('refugeeServiceCtrl', ['$scope','$http', 'NgTableParams', function($scope,$http,NgTableParams) {
    $scope.data = [];
    $scope.orgs = [];
    $scope.orgTable = new NgTableParams({
        page: 1,
        count: 10,
        filter: { firstName: "T" }
    }, {
        total: $scope.orgs.length,
        getData: function ($defer, params) {
            return $scope.orgs;//.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //$defer.resolve($scope.data);
        }
    });

    $scope.queryPoleCodesList = function(){
        console.log("querying");
        $http({
            method: 'post',
            url: '/api/organizations/search',
            data: pos,
        }).then(function successCallback(response) {
            //$scope.alert = null;
            $scope.orgs = response.data;
            $scope.orgTable.reload();
        }, function errorCallback(response) {
            // alert("The username or password is not correct, please try again.");
            //$scope.alert = response.data.msg;
        });
    };
}]);

$(document).ready(function() {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log(pos);
    }, function () {

    });
}
});
