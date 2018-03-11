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
