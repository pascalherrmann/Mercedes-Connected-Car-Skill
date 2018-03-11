'use strict';

const RestHelper = require('./rest-helper');
const Helpers = require('./Helpers');
const https = require("https");

const litersPer100KM = 7.5;

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
            this.__handleSimpleRequest(options, fulfill, reject);
        });
    }

    getLocation() {
        const path = `https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles/{0}/odometer`;

        return new Promise((fulfill, reject) => {
            this.__handleVehicleRequest(path, fulfill, reject);
        });
    }

    getFuel() {
        const path = `https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles/{0}/fuel`;

        return new Promise((fulfill, reject) => {
            this.__handleVehicleRequest(path, fulfill, reject);
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
    };

    // adds vehicle ID to simple request
    __handleVehicleRequest(path, fulfill, reject) {

        let carInfos = this.getCarsInfosConvencience();
        carInfos.then((id) => {
            console.log(id);
            const requestOptions = this.__getRequestOptions(path.format(id))
            this.__handleSimpleRequest(requestOptions, fulfill, reject);

        }).catch(function (e) {
            reject(e)
        });

    }

    __handleSimpleRequest(requestOptions, fulfill, reject) {
        https.get(requestOptions, (response) => {
            //console.log(`Device Address API responded with a status code of : ${response.statusCode}`);

            response.on('data', (data) => {
                let responsePayloadObject = JSON.parse(data);

                const r = {
                    statusCode: response.statusCode,
                    data: responsePayloadObject
                };

                fulfill(r);
            });
        }).on('error', (e) => {
            console.error(e);
            reject(e);
        });
    }

    getCarsInfosConvencience() {

        return new Promise((fulfill, reject) => {

            let carInfos = this.getCars();

            carInfos.then((carResponse) => {

                switch (carResponse.statusCode) {
                    case 200:

                        if (carResponse.data.length > 0) {
                            fulfill(carResponse.data[0].id);
                        } else {
                            fulfill(null);
                        }

                        break;
                    default:
                        reject(carResponse)
                }

            }).catch(function (e) {
                reject(e)
            });

        });

    }

}

module.exports.MercedesClient = MercedesClient;
