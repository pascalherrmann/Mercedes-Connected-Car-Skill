'use strict';

const RestHelper = require('./rest-helper');
const _ = require("./Helpers");

class MercedesClient {

    constructor(token) {
        console.log("TOKEN=" + token);
        this.consentToken = token;
        this.endpoint = "api.mercedes-benz.com";
        this.port = 443;
        this.vehicleID = "FA09055DE6731E05C7";
    }

    getCars(callback) {
        // TODO: Check in session, if carID is already available
        return this.__getCall("/experimental/connectedvehicle/v1/vehicles", callback);
    }

    getCarDetails(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}", callback);
    }

    getLocation(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/location", callback);
    }

    getTires(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/tires", callback);
    }

    getDoors(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/doors", callback);
    }

    getStateOfCharge(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/stateofcharge", callback);
    }

    getFuel(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/fuel", callback);
    }

    getMiles(callback) {
        return this.__getCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/odometer", callback);
    }

    postDoors(locking, callback) {
        var jsonObject = JSON.stringify({
            "command": locking ? "LOCK" : "UNLOCK"
        });

        return this.__postCallWithVehicleID("/experimental/connectedvehicle/v1/vehicles/{0}/doors", jsonObject, callback);
    }

    __postCallWithVehicleID(path, jsonObject, callback) {
        var self = this;
        this.getCars(function (error, result) {
            if (result == null || result.length == 0 || result[0] == null) {
                callback(error, result);
                return;
            }
            const carID = result[0].id;
            console.log(carID);
            const replacedPath = path.format(carID);
            self.__postCall(replacedPath, jsonObject, callback);
        })
    }

    __getCallWithVehicleID(path, callback) {

        if (this.vehicleID) {
            console.log("using vehicle ID from cache!");
            const replacedPath = path.format(this.vehicleID);
            this.__getCall(replacedPath, callback);
            return;
        }

        var self = this;
        this.getCars(function (error, result) {
            console.log("gerring cars!");
            if (error || result == 0) {
                callback(error, result);
                return;
            }
            const carID = result[0].id;
            console.log(carID);
            const replacedPath = path.format(carID);
            self.__getCall(replacedPath, callback);
        })
    }

    __postCall(path, jsonObject, callback) {
        const options = this.__getRequestOptions(path, true);
            RestHelper.postJSON(options, jsonObject, function (statusCode, result) {

            if (statusCode == 200 && result != null) {
                callback(null, result);
            } else {
                callback(statusCode, result);
            }

        });
    }

    __getCall(path, callback) {
        const options = this.__getRequestOptions(path);
        RestHelper.getJSON(options, function (statusCode, result) {

            if (statusCode == 200 && result != null) {
                callback(null, result);
            } else {
                callback(statusCode, result);
            }

        });
    }

    __getRequestOptions(path, post) {
        return {
            host: this.endpoint,
            port: this.port,
            path: path,
            method: post ? "POST" : "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.consentToken
            }
        };
    };

}

module.exports.MercedesClient = MercedesClient;
