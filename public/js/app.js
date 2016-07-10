/**
 * Created by Ming on 7/9/16.
 */

var app = angular.module('aHandApp', ['aHandModule',"ngTable","chart.js"]);
app.controller('commonCtrl', ['$scope','$http',function($scope,$http) {
$scope.test="<p>this is a testing msg from commonCtrl!</p>";

}]);

app.directive( 'elemReady', function( $parse ) {
    return {
        restrict: 'A',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$apply(function(){
                    var func = $parse(attrs.elemReady);
                    func($scope);
                })
            });
        }
    }
});
angular.module('aHandModule', [])
    .filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });

//module.exports = app;

var refugee = angular.module('aHandRefugeeApp', ["ngTable"]);

refugee.controller('commonRefugeeCtrl', ['$scope','$http',function($scope,$http) {
    $scope.test="this is a testing msg from commonCtrl!refugee";

}]);
