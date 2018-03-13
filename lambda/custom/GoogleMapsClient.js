'use strict';

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDhggKIP_dzJFNtwduUgBj3C7V_yQpp13A'
});

exports.getAddress = function (lat, long) {

    return new Promise((fulfill, reject) => {

        googleMapsClient.reverseGeocode({
            latlng: [lat, long]
        }, function (err, response) {
            if (!err) {
                const address = response.json.results[0];
                fulfill(address.formatted_address);
                return;

            } else reject();

        });
    });
}

exports.getDistance = function (lat, long, to) {
    return new Promise((fulfill, reject) => {

        console.log("Calling Google-getDistance");
        googleMapsClient.distanceMatrix({
            origins: [[lat, long]],
            destinations: to
        }, function (err, response) {
            console.log("Google Request completed!");
            if (!err) {
                try {
                    const dist = response.json.rows[0].elements[0].distance.text;
                    fulfill(dist);
                } catch (e) {
                    reject();
                }

            } else {
                console.log(err);
                reject();
            }
        });

    })
}
