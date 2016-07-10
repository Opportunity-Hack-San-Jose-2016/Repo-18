/**
 * Created by Crystal on 7/9/16.
 */
app.controller("PieCtrl", function ($scope) {

    
    $scope.ageLabels = ["Male, Age under 10", "Female, Age under 10", "Male, Age 11-20", "Female, Age 11-20", "Male, Age 21-35", "Female, Age 21-35"
     ,"Male, Age 36-60", "Female, Age 36-60", "Male, Age 60+", "Female, Age 60+"];
    $scope.ageData = [300, 500, 100, 980, 32526, 342, 1245, 3573, 234, 2123];
    $scope.requestLabels = ["Health", "Water", "Shelter"];
    $scope.requestData = [200, 400, 122];

});

