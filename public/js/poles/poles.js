/**
 * Created by Ming on 7/9/16.
 */
// const app = require('./app.js');
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
        $scope.generateBarcodeImg();
    }
    $scope.generateBarcodeImg = function(){
        bwipjs.toBuffer({
            bcid:        'code128',       // Barcode type
            text:        '0123456789',    // Text to encode
            scale:       3,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign:  'center',        // Always good to set this
            //textfont:    'Inconsolata',   // Use your custom font
            textsize:    13               // Font size, in points
        }, function (err, png) {
            if (err) {
                // Decide how to handle the error
                // `err` may be a string or Error object
            } else {
                console.log("begin to write.");
                // `png` is a Buffer
                // png.length           : PNG file length
                png.readUInt32BE(16);// PNG image width
                png.readUInt32BE(20);// PNG image height
                var fs = require('fs');
                var wstream = fs.createWriteStream('testP.png');
                wstream.write(png);
                //wstream.write('Another line\n');
                wstream.end();
            }
        });
    }
}]);