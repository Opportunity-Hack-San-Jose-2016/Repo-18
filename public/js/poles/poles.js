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
    $scope.data = [];
    $scope.poles = [];
    $scope.wholePoles = [];
    $scope.showLoader = false;
    $scope.poleWholeTable = new NgTableParams({
        page: 1,
        count: 10,
        filter: { firstName: "T" }
    }, {
        total: $scope.poles.length,
        getData: function ($defer, params) {
            return $scope.wholePoles;//.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //$defer.resolve($scope.data);
        }
    });
    $scope.queryWholePoleTable = function(){
        console.log("querying whole poles");
        $http({
            method: 'post',
            url: '/api/poles/list',
            data:{page:1},
        }).then(function successCallback(response) {
            //$scope.alert = null;
            $scope.wholePoles = response.data;
            $scope.poleWholeTable.reload();
        }, function errorCallback(response) {
            // alert("The username or password is not correct, please try again.");
            //$scope.alert = response.data.msg;
        });
    };
    $scope.poleTable = new NgTableParams({
        page: 1,
        count: 10,
        filter: { firstName: "T" }
    }, {
        total: $scope.poles.length,
        getData: function ($defer, params) {
            return $scope.poles;//.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //$defer.resolve($scope.data);
        }
    });
    $scope.poleTable.isFiltersVisible = false;
    $scope.queryPoleCodesList = function(){
        console.log("querying");
        $http({
         method: 'post',
         url: '/api/poles/list',
         data:{page:1},
         }).then(function successCallback(response) {
         //$scope.alert = null;
         $scope.poles = response.data;
            $scope.poleTable.reload();
         }, function errorCallback(response) {
         // alert("The username or password is not correct, please try again.");
         //$scope.alert = response.data.msg;
         });
    };
    $scope.generatePreview = function(){
        $scope.previewStart = $scope.codePrefix+""+$scope.formatNum($scope.codeStart,5);
        $scope.previewEnd =$scope.codePrefix+""+ $scope.formatNum($scope.codeStart + $scope.amount-1,5);
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
        var array = [];
        for(var i = $scope.codeStart; i<=$scope.amount; i++){
            array.push({"poleCode":$scope.codePrefix+ $scope.formatNum(i,5),"state":"initial"});
        }
        $scope.poles = array;
        $scope.poleTable.reload();
        $scope.postCreatePoleCodes(function(){

        });
        if(array.length>0) {
            $scope.showLoader = true;
            $scope.generatePDFS();
        }
    };
    $scope.postCreatePoleCodes = function(callback){
        var array = [];
        for(var i = $scope.codeStart; i<=$scope.amount; i++){
            array.push($scope.codePrefix+ $scope.formatNum(i,5))
        }
        $http({
            method: 'POST',
            url: '/api/batchCreatePoleCodes',
            data:{poleCodes:array},
        }).then(function successCallback(response) {
            callback();
            $scope.alert = "finished";
            // $scope.queryDrivers();
        }, function errorCallback(response) {
            callback();
            // alert("The username or password is not correct, please try again.");
            //$scope.alert = response.data.msg;
        });
    };
    $scope.generateBarcodeImg = function(){
        
    };
    $scope.generatePDFS = function(){

        var array = [];
        for(var i = $scope.codeStart; i<=$scope.amount; i++){
            array.push($scope.codePrefix+ $scope.formatNum(i,5))
        }
        console.log("poleCodes","poleCodes");
        $http({
            method: 'POST',
            url: '/api/generatePoleCodesPDF',
            data:{poleCodes:array},
        }).then(function successCallback(response) {
            $scope.showLoader = false;
            // $scope.queryDrivers();
        }, function errorCallback(response) {
            // alert("The username or password is not correct, please try again.");
            $scope.alert = response.data.msg;
        });
    }
}]);