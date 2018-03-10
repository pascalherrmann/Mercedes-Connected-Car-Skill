const MercedesClient = require('./MercedesClientSimple');

var client = new MercedesClient.MercedesClient("f21e7692-a72e-42ed-a7c5-71bdd8200fcd");

client.getMiles(function (err, res) {
    if (!err && res) {
        console.log(res);
    } else {
        console.log("error");
        console.log(err);
    }
});
