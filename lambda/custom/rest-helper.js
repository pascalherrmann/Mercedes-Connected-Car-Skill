var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function (options, onResult) {
    console.log("rest::getJSON");

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function (res) {

        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            console.log("jo")
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

    req.end();
};