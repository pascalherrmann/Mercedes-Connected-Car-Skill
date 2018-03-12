'use strict';

var http = require("http");
var https = require("https");

exports.getJSON = function (options, onResult) {

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function (res) {

        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            console.log(output)
            try{
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
            } catch(e) {
                onResult(e, null);
            }
        });

        res.on('uncaughtException', function (err) {
            console.log(err);
        });
    });

    req.on('error', function (err) {
        console.log(err)
        onResult(0, err);
    });

    req.end();
};

exports.postJSON = function (options, jsonObject, onResult) {

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function (res) {

        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            console.log(output)
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });

        res.on('uncaughtException', function (err) {
            console.log(err);
        });
    });

    req.on('error', function (err) {
        console.log(err)
        onResult(0, err);
    });

    req.write(jsonObject);
    req.end();
};
