'use strict';

// This is the technical base of the GET- & POST- REQUESTS.

const http = require("http");
const https = require("https");

exports.doRequest = function (options, jsonObject, fulfill, reject) {

    const httpX = options.port == 443 ? https : http;

    const req = httpX.request(options, (response) => {

        var output = '';
        //console.log(options.host + ':' + res.statusCode);
        response.setEncoding('utf8');

        response.on('data', function (chunk) {
            output += chunk;
        });

        response.on('end', function () {
            console.log(output)
            try {
                const obj = JSON.parse(output);
                const r = {
                    statusCode: response.statusCode,
                    data: obj
                };
                fulfill(r);
            } catch (e) {
                reject(e);
            }
        });

        response.on('uncaughtException', function (err) {
            console.log(err);
            reject(err);
        });
    });

    req.on('error', (err) => {
        console.log(err)
        reject(err);
    });

    if (jsonObject) req.write(jsonObject);

    req.end();
};
