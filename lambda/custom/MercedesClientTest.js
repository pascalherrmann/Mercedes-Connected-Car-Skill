const MercedesClient = require('./MercedesClientSimple');

var client = new MercedesClient.MercedesClient("a60a9008-b35e-41e9-a39a-4a86f2da7352");

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
