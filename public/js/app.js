/**
 * Created by Ming on 7/9/16.
 */
var app = angular.module('aHandApp', ["chart.js",'uiGmapgoogle-maps']);

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

//module.exports = app;