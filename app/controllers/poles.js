'use strict';
const log = require('../utils/log');
const util = require('../utils/util');
const CONST = require('../values/constants');
const ERROR = require('../values/error');
const mongo = require('../utils/mongo-util');
const bwipjs = require('bwip-js');
const fs = require('fs');
const PDF = require('pdfkit');
const async = require('async');
// const pdf = require('html-pdf');
// const path = require("path");

exports.seartch = function (req){
    
};

exports.doCreate = function (req) {
    log.req(req);
    var poleCodes = req.body.poleCodes;
    var array = [];
    for(var i = 0; i < poleCodes.length; i++){
        array.push({
            "poleCode":""+poleCodes[i],
            "state":""+CONST.POLE_STATE_INITIAL
        })
    }
    // generate pole code here
    var db = require('../utils/mongodb'),
        test = require('assert');
        // Get the collection
        var col = db.collection(CONST.COLLECTION_POLE);
        col.insertMany(array).then(function(r) {
            test.equal(array.length, r.insertedCount);
            // Finish up test
            db.close();
        });
}

function doUpdate(req) {
    log.req(req);
    // validate
    var form = util.copy(req.body, ["poleCode", "lat", "long", "state", "address", "placeName"]);
    form.date = new Date();
    if (form.poleCode) {
        form.poleCode = form.poleCode.toLowerCase().trim();
    }
    log.v('form is ', form);

    return mongo.get({
        poleCode: form.poleCode
    }, CONST.COLLECTION_POLE).spread(function (pole) {
        if (!pole) {
            // return Promise.rejected(ERROR.invalidParam('poleCode'));
            pole = {};
        }
        util.setProperties(pole, form);
        return mongo.put(pole, CONST.COLLECTION_POLE);
    });
}

exports.update = function (req, res) {
    doUpdate(req).then(function (result) {
        ERROR.render(res, '');
    }).catch(function (err) {
        throw 'fix me';
    });
};

exports.updateApi = function (req, res) {
    doUpdate(req).then(function (result) {
        ERROR.ok(res, result);
    }).catch(function (err) {
        ERROR.badRequest(res, err);
    });
};
exports.generatePolePDFBatch = function(req,res){
    console.log("getting in");
    var poleCodes = req.body.poleCodes;
    console.log(typeof poleCodes);
    console.log("1:",poleCodes[1]);
    //poleCodes = poleCodes.split(",");
    console.log("poleCodes",poleCodes);

    //------
    async.series([
            function (callback) {
                console.log("begin to png 1", poleCodes);
                // exports.generateBarcodeImgBatch(poleCodes);
                for(var i= 0; i<poleCodes.length;i++){
                    console.log("poleCodes=>",poleCodes[i]);
                    exports.generateBarcodeImg(poleCodes[i]);
                };
                callback(0);
            },
            function (callback) {
                console.log("begin to pdf", poleCodes);
                var doc = new PDF();
                for(var i =0; i<poleCodes.length;i++){
                    doc = exports.generatePolePDF(i,doc,poleCodes[i]);
                }
                doc.write("output1.pdf");
                callback(1);
            }
        ],
        function (err, results) {
            if (err) {
                console.log(err);
                // if(callback)callback("*E init truck error\n");
            }
            else {
                console.log("^_^: Init truck done!\n");
                //if(callback)callback();
                res.send("done");
            }
        });

};
exports.generatePolePDF = function(index,doc,poleCode){
    if(index != 0) {
        doc.addPage();
    }
    doc.fontSize(48);
    doc.text("HELP IS AROUND",100,100);
    doc.image('app/views/pole/barcodeImg/'+poleCode+'.png', 100, 180,{width: 400, height: 180});
    doc.save().moveTo(100, 400);
    doc.fontSize(20);
    doc.text("If you are a refugee hoping get help, please\n" +
             "send 9512 a message. In the message please\n " +
             "include the code above, your UNID, and your\n" +
             "need, like the example below:",100,450);
    doc.fontSize(25);
    doc.text(poleCode+",UNIDXXXX,FOOD",100,560);
    doc.text("No worries, help is on the way!",100,620);
    //doc.end();
    return doc;
};
exports.generateBarcodeImgBatch = function(codes){
    console.log("codes",codes);
    codes.forEach(function(item){
        exports.generateBarcodeImg(item);
    });
};
exports.generateBarcodeImg = function(code){
    console.log("img code",code);
    bwipjs.toBuffer({
        bcid:        'code128',       // Barcode type
        text:        code,//'SANJ95270',    // Text to encode
        scale:       5,               // 3x scaling factor
        height:      15,              // Bar height, in millimeters
        includetext: true,            // Show human-readable text
        textxalign:  'center',        // Always good to set this
        //textfont:    'Inconsolata',   // Use your custom font
        textsize:    21               // Font size, in points
    }, function (err, png) {
        if (err) {
            // Decide how to handle the error
            // `err` may be a string or Error object
        } else {
            console.log("begin to write.");
            // `png` is a Buffer
            // png.length           : PNG file length
            png.readUInt32BE(600);// PNG image width
            png.readUInt32BE(450);// PNG image height
            var wstream = fs.createWriteStream("app/views/pole/barcodeImg/"+code+'.png');
            wstream.write(png);
            //wstream.write('Another line\n');
            wstream.end();
            console.log("barcode done");
        }
    });
};
