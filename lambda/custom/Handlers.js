'use strict';

// Internal imports
const MercedesClient = require('./MercedesClientSimple');
const GoogleMapsClient = require('./GoogleMapsClient');
const Intents = require('./Intents');
const Events = require('./Events');

/*
    All Handlers for Custom Events and Intents
*/

function getErrorMessage(self, error, standardText) {

    switch (error) {
        case 403:
            return self.t("ERROR_403");
        case 408:
            return self.t("ERROR_408");
        case 429:
            return self.t("ERROR_429");
        case 500:
            return self.t("ERROR_500");
        default:
            return standardText;
    }

}

function handleLock(locking, self) {

    const client = new MercedesClient.MercedesClient(self.event.session.user.accessToken, self.attributes['carID']);
    client.postDoors(locking, function (error, response) {
        var speechOutput = "";
        if (!error && response.status == "INITIATED") {
            speechOutput = locking ? self.t("FEEDBACK_LOCKING") : self.t("FEEDBACK_UNLOCKING");
        } else {
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
        }
        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
    });

}

const getDoorsHandler = function () {
    console.info("Starting getDoorsHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getDoors(function (error, response) {
        var speechOutput = "";
        if (!error && response) {

            const doors = ["doorlockstatusfrontleft", "doorlockstatusfrontright", "doorlockstatusrearright", "doorlockstatusrearleft"];
            const doornames = [self.t("DOOR_FRONT_LEFT"), self.t("DOOR_FRONT_RIGHT"), self.t("DOOR_REAR_LEFT"), self.t("DOOR_REAR_RIGHT")];

            var unlockedDoors = "";
            for (let i = 0; i < doors.length; i++) {
                if (response[doors[i]].value == "UNLOCKED") {
                    if (unlockedDoors) {
                        unlockedDoors += ", ";
                    }
                    unlockedDoors += doornames[i];
                }
            }

            if (unlockedDoors) {
                speechOutput = self.t("FEEDBACK_DOORS_GENERAL", unlockedDoors);
            } else {
                speechOutput = self.t("FEEDBACK_DOORS_ALL_LOCKED");
            }

        } else {
            console.log(error);
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
        }
        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
    });

    console.info("Ending getDoorsHandler()");
}

const getLocationHandler = function () {
    console.info("Starting getLocationHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getLocation(function (error, response) {
        var speechOutput = "";
        if (!error && response != null) {

            GoogleMapsClient.getAddress(response.latitude.value, response.longitude.value, function (city) {
                if (city) {
                    speechOutput = self.t("FEEDBACK_POSITION", city);
                } else {
                    speechOutput = self.t("FEEDBACK_COORDINATES", response.latitude.value, response.longitude.value);
                }
                self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
            });

        } else {
            console.log(error);
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
            self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
        }

    });

    console.info("Ending getLocationHandler()");
}

const lockDoorsHandler = function () {
    console.info("Starting lockDoorsHandler()");
    handleLock(true, this);
    console.info("Ending lockDoorsHandler()");
}

const unlockDoorsHandler = function () {
    console.info("Starting unlockDoorsHandler()");
    handleLock(false, this);
    console.info("Ending unlockDoorsHandler()");
}

const getFuelLevelHandler = function () {
    console.info("Starting getFuelLevelHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getFuel(function (error, response) {
        var speechOutput = "";
        if (!error && response.fuellevelpercent.value != null) {
            speechOutput = self.t("FEEDBACK_FUEL_LEVEL", response.fuellevelpercent.value);
        } else {
            console.log(error);
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
        }
        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
    });

    console.info("Ending getFuelLevelHandler()");
}

const checkEnoughFuelHandler = function () {
    console.info("Starting checkEnoughFuelHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const destinationSlot = this.event.request.intent.slots.destination;
    const city = destinationSlot.value;
    var self = this;

    client.getLocation(function (error, response) {
        var speechOutput = "";
        if (!error && response != null) {

            GoogleMapsClient.getDistance(response.latitude.value, response.longitude.value, city, function (err, distance, duration, origin, destination) {
                if (distance && duration && origin && destination) {

                    client.getStateOfCharge(function (error, response) {
                        if (!error && response.stateofcharge.value != null) {

                            const chargeLevel = response.stateofcharge.value;
                            const distanceComma = distance.substring(0, distance.indexOf(" "));
                            const distanceString = distanceComma.replace(",", "");
                            const distanceInt = parseInt(distanceString);
                            const maxRange = 517;
                            const remainingRange = Math.floor(maxRange * chargeLevel / 100);
                            const chargeTimes = Math.ceil((distanceInt - remainingRange) / maxRange);

                            speechOutput = self.t("FEEDBACK_DISTANCE", city, distance) + self.t("FEEDBACK_CHARGE", chargeLevel, remainingRange);

                            if (remainingRange >= distanceInt) {
                                speechOutput += self.t("FEEDBACK_CHARGE_ENOUGH");
                            } else if (maxRange >= distanceInt) {
                                speechOutput += self.t("FEEDBACK_CHARGE_NEED_CHARGE");
                            } else if (chargeTimes >= 10) {
                                speechOutput += self.t("FEEDBACK_CHARGE_TOO_FAR");
                            } else if (chargeTimes == 1) {
                                speechOutput += self.t("FEEDBACK_CHARGE_ONE_CHARGE");
                            } else {
                                speechOutput += self.t("FEEDBACK_CHARGE_CHARGETIMES", chargeTimes);
                            }

                        } else {
                            console.log(error);
                            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
                        }
                        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
                    });

                } else {
                    console.log(err);
                    self.emit(":ask", self.t("ERROR_DISTANCE", city), self.t("WHAT_DO_YOU_WANT"));
                }

            });

        } else {
            console.log(error);
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
            self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
        }

    });

    console.info("Ending checkEnoughFuelHandler()");
}

const getLicensePlateHandler = function () {
    console.info("Starting getLicensePlateHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getCars(function (error, response) {
        var speechOutput = "";
        if (!error && response != null) {
            speechOutput = self.t("FEEDBACK_LICENSE_PLATE", response[0].licenseplate);
        } else {
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
        }

        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
    });

    console.info("Ending getLicensePlateHandler()");
}

const getMilesHandler = function () {
    console.info("Starting getMilesHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getMiles(function (error, response) {
        var speechOutput = "";
        if (!error && response != null) {

            const imageObj = {
                smallImageUrl: 'https://s.aolcdn.com/dims-global/dims3/GLOB/legacy_thumbnail/788x525/quality/85/https://s.aolcdn.com/commerce/autodata/images/USC60MBC891A021001.jpg',
                largeImageUrl: 'https://s.aolcdn.com/commerce/autodata/images/USC60MBC891A021001.jpg'
            };

            const total = response.odometer.value;
            const sinceReset = response.distancesincereset.value;
            const current = response.distancesincestart.value;
            speechOutput = self.t("FEEDBACK_ODOMETER", total, sinceReset, current);
            const cardTitle = self.t("FEEDBACK_ODOMETER_CARD_TITLE");
            const cardContent = self.t("FEEDBACK_ODOMETER_CARD_CONTENT", total, sinceReset, current);
            self.emit(':askWithCard', speechOutput, self.t("WHAT_DO_YOU_WANT"), cardTitle, cardContent, imageObj);

        } else {
            console.log(error);
            speechOutput = getErrorMessage(self, error, self.t("ERROR"));
            self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
        }

    });

    console.info("Ending getMilesHandler()");
}

/*
    All Handlers for Amazon Built In Events and Intents
*/

const newSessionRequestHandler = function () {
    console.info("Starting newSessionRequestHandler()");

    const self = this;
    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    client.getCars(function (error, response) {
        if (!error && response != null) {
            self.attributes['carID'] = response[0].id;
            self.attributes['licenseplate'] = response[0].licenseplate;
        } else {
            self.emit(":tell", self.t("COULD_NOT_CONNECT_TRY_AGAIN"));
        }

        if (self.event.request.type === Events.LAUNCH_REQUEST) {
            self.emit(Events.LAUNCH_REQUEST);
        } else if (self.event.request.type === "IntentRequest") {
            self.emit(self.event.request.intent.name);
        }

    });

    console.info("Ending newSessionRequestHandler()");
};

const launchRequestHandler = function () {
    console.info("Starting launchRequestHandler()");
    this.emit(":ask", this.t("WELCOME") + this.t("WHAT_DO_YOU_WANT"), this.t("WHAT_DO_YOU_WANT"));
    console.info("Ending launchRequestHandler()");
};

const sessionEndedRequestHandler = function () {
    console.info("Starting sessionEndedRequestHandler()");
    this.emit(":tell", this.t("GOODBYE"));
    console.info("Ending sessionEndedRequestHandler()");
};

const unhandledRequestHandler = function () {
    console.info("Starting unhandledRequestHandler()");
    this.emit(":ask", this.t("UNHANDLED"), this.t("UNHANDLED"));
    console.info("Ending unhandledRequestHandler()");
};

const amazonHelpHandler = function () {
    console.info("Starting amazonHelpHandler()");
    this.emit(":ask", this.t("HELP"), this.t("HELP"));
    console.info("Ending amazonHelpHandler()");
};

const amazonCancelHandler = function () {
    console.info("Starting amazonCancelHandler()");
    this.emit(":tell", this.t("GOODBYE"));
    console.info("Ending amazonCancelHandler()");
};

const amazonStopHandler = function () {
    console.info("Starting amazonStopHandler()");
    this.emit(":ask", this.t("STOP"), this.t("STOP"));
    console.info("Ending amazonStopHandler()");
};

const handlers = {};
// Add event handlers
handlers[Events.NEW_SESSION] = newSessionRequestHandler;
handlers[Events.LAUNCH_REQUEST] = launchRequestHandler;
handlers[Events.SESSION_ENDED] = sessionEndedRequestHandler;
handlers[Events.UNHANDLED] = unhandledRequestHandler;

// Add intent handlers
handlers[Intents.AMAZON_CANCEL] = amazonCancelHandler;
handlers[Intents.AMAZON_STOP] = amazonStopHandler;
handlers[Intents.AMAZON_HELP] = amazonHelpHandler;

// Custom
handlers[Intents.GET_FUEL_LEVEL] = getFuelLevelHandler;
handlers[Intents.GET_LICENSE_PLATE] = getLicensePlateHandler;
handlers[Intents.GET_MILES] = getMilesHandler;
handlers[Intents.LOCK_DOORS] = lockDoorsHandler;
handlers[Intents.UNLOCK_DOORS] = unlockDoorsHandler;
handlers[Intents.GET_DOORS] = getDoorsHandler;
handlers[Intents.GET_LOCATION] = getLocationHandler;
handlers[Intents.CHECK_ENOUGH_FUEL] = checkEnoughFuelHandler;

module.exports = handlers;
