const MercedesClient = require('./MercedesClientSimple');

var client = new MercedesClient.MercedesClient("9cbd145e-d6a0-4fa0-bbff-6c1d7b5191f0");

                    client.getStateOfCharge(function (error, response) {
                        console.log(response)

                    });

/*

client.getDoors(function (err, res) {
    if (!err && res) {
        console.log(res);
    } else {
        console.log("error");
        console.log(err);
    }
});



var googleMapsClient = require("./GoogleMapsClient");

googleMapsClient.getDistance(37, -122, "Los Angeles", function (distance, duration, origin, destination) {
        console.log(distance);
        console.log(duration);
        console.log(origin);
        console.log(destination);


        if (distance && duration && origin && destination) {
            console.log("GREAT")
        } else {
            console.log("shit")
        }
});
*/
