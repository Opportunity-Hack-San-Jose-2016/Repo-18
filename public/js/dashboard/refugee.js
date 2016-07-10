/**
 * Created by ljtao on 7/10/16.
 */
app.controller('submitFormController', ['$scope','$http',function($scope,$http) {
    $scope.formData = {};

    $scope.submitForm = function () {
        $http({
            method:'POST',
            url:'/api/refugees',
            data:$scope.formData
        }).success(function(data) {
            if (data.errors) {
                $scope.errorUNID = data.errors.unid;
            } else {
                $scope.message = data.message;
            }
        })
    }
}]);
