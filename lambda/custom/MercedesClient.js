'use strict';

const RestHelper = require('./rest-helper');
const https = require("https");

class MercedesClient {

    constructor(token) {
        console.log(token);
        this.consentToken = token;

        this.endpoint = "api.mercedes-benz.com";
        this.port = 443;
    }


    getCars() {
        const options = this.__getRequestOptions(
            `/experimental/connectedvehicle/v1/vehicles`);

        return new Promise((fulfill, reject) => {
            this.__handleDeviceAddressApiRequest(options, fulfill, reject);
        });
    }


    __handleDeviceAddressApiRequest(requestOptions, fulfill, reject) {
        console.log("JO");
        https.get(requestOptions, (response) => {
            //console.log(`Device Address API responded with a status code of : ${response.statusCode}`);

            response.on('data', (data) => {
                let responsePayloadObject = JSON.parse(data);

                const deviceAddressResponse = {
                    statusCode: response.statusCode,
                    address: responsePayloadObject
                };

                fulfill(deviceAddressResponse);
            });
        }).on('error', (e) => {
            console.log("oops");
            console.error(e);
            reject();
        });
    }

    __getRequestOptions(path) {
        return {
            host: this.endpoint,
            path: path,
            method: 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.consentToken
            }
        };
    }

}

var client = new MercedesClient("1f396e57-51de-4126-bd18-c7f894770535");

let deviceAddressRequest = client.getCars();

deviceAddressRequest.then((carResponse) => {

    switch (carResponse.statusCode) {
        case 200:
            console.log("Perfect!");
            break;
        case 204:
            console.log("Successfully requested from the device address API, but no address was returned.");
            break;
        default:
            console.log("Error: Status-Code=" + carResponse.statusCode);
    }

}).catch(function(e) {
    console.log(e);
    console.log("Something went wrong!");
});