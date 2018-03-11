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
