const MercedesClient = require('./MercedesClientSimple');

var client = new MercedesClient.MercedesClient("5b8cdac6-9a97-4735-ab9b-718a7f58783d");

client.postDoors(true, function (err, res) {
    if (!err && res) {
        console.log(res);
    } else {
        console.log("error");
        console.log(err);
    }
});
