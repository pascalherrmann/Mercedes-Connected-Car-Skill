const RestHelper = require('./rest-helper');

exports.getCars = function (token, callback) {
    
    console.log(token);

    var options = {
        host: 'api.mercedes-benz.com',
        port: 443,
        path: '/experimental/connectedvehicle/v1/vehicles',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    RestHelper.getJSON(options, function (statusCode, result) {

        if (statusCode == 200 && result != null) {
            callback(null, result);
        } else {
            callback(statusCode, result);
        }

    });

};