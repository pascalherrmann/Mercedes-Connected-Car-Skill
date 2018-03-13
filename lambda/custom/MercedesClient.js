'use strict';

const requestHelper = require('./RequestHelper');
const helpers = require("./Helpers");

class MercedesClient {

    constructor(token, vehicleID) {
        console.log("Creating Client instance.");
        console.log("TOKEN=" + token);
        this.token = token;
        this.vehicleID = vehicleID;
        this.port = 443;
        this.endpoint = "api.mercedes-benz.com";
    }

    getCarInfo() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles")
    }

    getLocation() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/location")
    }

    getDoors() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/doors")
    }

    getStateOfCharge() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/stateofcharge")
    }

    getOdometer() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/odometer")
    }

    getFuel() {
        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/fuel")
    }

    postDoors(locking, callback) {
        var jsonObject = JSON.stringify({
            "command": locking ? "LOCK" : "UNLOCK"
        });

        return this.__getPromise("/experimental/connectedvehicle/v1/vehicles/{0}/doors", true, jsonObject);
    }

    __getPromise(path, post, jsonBody) {
        const options = this.__getRequestOptions(path, post);

        return new Promise((fulfill, reject) => {
            requestHelper.doRequest(options, jsonBody, fulfill, reject);
        });
    }

    __getRequestOptions(path, post) {
        const replacedPath = path.format(this.vehicleID);
        return {
            hostname: this.endpoint,
            port: this.port,
            path: replacedPath,
            method: post ? 'POST' : 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        };
    }
}

module.exports = MercedesClient;
