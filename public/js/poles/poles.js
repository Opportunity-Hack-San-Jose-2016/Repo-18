/**
 * Created by Ming on 7/9/16.
 */

app.controller('poleCtrl', ['$scope','$http','NgTableParams',function($scope,$http,NgTableParams) {
    $scope.poleTest="<p>this is a testing msg from dashboardCtrl!</p>";
    $scope.codePrefix="";
    $scope.amount=0;
    $scope.codeStart=0;
    $scope.previewStart ="";
    $scope.previewEnd ="";

    $scope.generatePreview = function(){
        $scope.previewStart = $scope.codePrefix+""+$scope.formatNum($scope.codeStart,5);
        $scope.previewEnd =$scope.codePrefix+""+ $scope.formatNum($scope.codeStart + $scope.amount,5);
        console.log("amount",$scope.amount);
        console.log("previewStart",$scope.previewStart);
        console.log("previewEnd",$scope.previewEnd);
    };
    $scope.formatNum = function (n, len) {
        var num = parseInt(n);
        len = parseInt(len);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
    $scope.preGenerateCode = function(){
        //var self = this;
        //var data = [{name: "Moroni", age: 50} /*,*/];
        //self.tableParams = new NgTableParams({}, { dataset: data});
        //$scope.generateBarcodeImg();
        $scope.generatePDFS();
    }
    $scope.generateBarcodeImg = function(){
        
    }
    $scope.generatePDFS = function(){
        var poleCodes = ["SAN12345","SAN12346","SAN12347","SAN12347"];
        console.log("poleCodes","poleCodes");
        $http({
            method: 'POST',
            url: '/api/generatePoleCodes',
            data:{poleCodes:poleCodes},
        }).then(function successCallback(response) {
            $scope.alert = "finished";
            // $scope.queryDrivers();
        }, function errorCallback(response) {
            // alert("The username or password is not correct, please try again.");
            $scope.alert = response.data.msg;
        });
    }
}]);