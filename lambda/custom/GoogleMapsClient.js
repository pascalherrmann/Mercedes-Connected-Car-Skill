var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDhggKIP_dzJFNtwduUgBj3C7V_yQpp13A'
});

function test() {
    // Geocode an address.
    googleMapsClient.geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    }, function (err, response) {
        if (!err) {
            // console.log(response.json.results);
        }
    });
}

exports.getCity = function (lat, long, callback) {

    googleMapsClient.reverseGeocode({
        latlng: [lat, long]
    }, function (err, response) {
        if (!err) {

            const address = response.json.results[0].address_components;

            return address.forEach(function (address_component) {

                if (address_component.types[0] == "locality") { // locality type
                    callback(address_component.long_name);
                    return;
                }
            });

            callback(null);
            return;

        } else callback(null);

    });
}

exports.getAddress = function (lat, long, callback) {

    googleMapsClient.reverseGeocode({
        latlng: [lat, long]
    }, function (err, response) {
        if (!err) {

            const address = response.json.results[0];

            callback(address.formatted_address);
            return;

        } else callback(null);

    });
}

exports.getDistance = function (lat, long, to, callback) {
        googleMapsClient.distanceMatrix({
        origins: [[lat,long]],
        destinations: to
    }, function (err, response) {
            console.log(err);
            console.log(response.json.rows[0]);
        if (!err) {
            console.log("callbakc!")

            try{
            const dist = response.json.rows[0].elements[0].distance.text;
            const dur = response.json.rows[0].elements[0].duration.text;
            const org = response.json.origin_addresses[0];
            const dest = response.json.destination_addresses[0];
                callback(err, dist, dur, org, dest);
            } catch(e) {
                callback(e, null, null, null, null);
            }

        }
        else {
            console.log("error callbck")
            console.log(err);
            callback(err, null, null, null, null);
        }
    });
}
