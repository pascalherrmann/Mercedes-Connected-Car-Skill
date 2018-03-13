'use strict';

// Internal imports
const Intents = require('./Intents');
const Events = require('./Events');
const Helpers = require('./Helpers/Helpers');

const GoogleMapsClient = require('./Clients/GoogleMapsClient');
const MercedesClient = require("./Clients/MercedesClient");
const carModel = require("./Model/CarModel");

/*
    All Handlers for Custom Events and Intents
*/

function handleRequest(request) {

}

function reply(self, speechOutput) {
    if (self.attributes['launched']) {
        self.emit(":ask", speechOutput, self.t("WHAT_DO_YOU_WANT"));
    } else {
        self.emit(":tell", speechOutput);
    }
}

function replyWithCard(self, speechOutput, cardTitle, cardContent, imageObj) {
    if (self.attributes['launched']) {
        self.emit(':askWithCard', speechOutput, self.t("WHAT_DO_YOU_WANT"), cardTitle, cardContent, imageObj);
    } else {
        self.emit(':tellWithCard', speechOutput, self.t("WHAT_DO_YOU_WANT"), cardTitle, cardContent, imageObj);
    }
}

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
            if (standardText) {
                return standardText;
            } else {
                return self.t("ERROR");
            }
    }
}

function handleLock(locking, self) {

    const client = new MercedesClient(self.event.session.user.accessToken, self.attributes['carID']);
    let request = client.postDoors(locking);
    request.then((r) => {
        const success = carModel.doorFeedback(r.data);
        if (success && r.statusCode == 200) {
            const speechoutput = locking ? self.t("FEEDBACK_LOCKING") : self.t("FEEDBACK_UNLOCKING");
            reply(self, speechoutput);
        } else {
            reply(self, getErrorMessage(self, r.statusCode));
        }
    }).catch((e) => {
        reply(self, self.t("ERROR"));
        console.log(e);
    });

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

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    let request = client.getFuel();
    request.then((r) => {
        const fuel = carModel.fuel(r.data);
        if (fuel && r.statusCode == 200) {
            reply(this, this.t("FEEDBACK_FUEL_LEVEL", fuel));
        } else {
            reply(this, getErrorMessage(this, r.statusCode));
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending getFuelLevelHandler()");
}

const getLicensePlateHandler = function () {
    console.info("Starting getLicensePlateHandler()");

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    let request = client.getCarInfo();
    request.then((r) => {
        const carInfo = carModel.carInfo(r.data);
        if (carInfo && r.statusCode == 200) {
            reply(this, this.t("FEEDBACK_LICENSE_PLATE", carInfo.licenseplate));
        } else {
            reply(this, getErrorMessage(this, r.statusCode));
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending getLicensePlateHandler()");
}

const getMilesHandler = function () {
    console.info("Starting getMilesHandler()");

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    let request = client.getOdometer();
    request.then((r) => {
        const odometer = carModel.odometer(r.data);
        if (odometer && r.statusCode == 200) {
            const imageObj = {
                smallImageUrl: 'https://s.aolcdn.com/dims-global/dims3/GLOB/legacy_thumbnail/788x525/quality/85/https://s.aolcdn.com/commerce/autodata/images/USC60MBC891A021001.jpg',
                largeImageUrl: 'https://s.aolcdn.com/commerce/autodata/images/USC60MBC891A021001.jpg'
            };
            const speechOutput = this.t("FEEDBACK_ODOMETER", odometer.total, odometer.reset, odometer.start);
            const cardTitle = this.t("FEEDBACK_ODOMETER_CARD_TITLE");
            const cardContent = this.t("FEEDBACK_ODOMETER_CARD_CONTENT", odometer.total, odometer.reset, odometer.start);
            replyWithCard(this, speechOutput, cardTitle, cardContent, imageObj);
        } else {
            reply(this, getErrorMessage(this, r.statusCode));
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending getMilesHandler()");
}

const getDoorsHandler = function () {
    console.info("Starting getDoorsHandler()");

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    let request = client.getDoors();
    request.then((r) => {
        const doors = carModel.doors(r.data);
        if (doors && r.statusCode == 200) {
            var unlockedDoors = "";

            for (let i = 0; i < doors.length; i++) {
                if (doors[i].value == "UNLOCKED") {
                    if (unlockedDoors) {
                        unlockedDoors += ", ";
                    }
                    unlockedDoors += this.t(doors[i].str);
                }
            }

            unlockedDoors = Helpers.replaceLast(unlockedDoors, ",", " " + this.t("AND"));

            if (unlockedDoors) {
                reply(this, this.t("FEEDBACK_DOORS_GENERAL", unlockedDoors));
                console.log(this.t("FEEDBACK_DOORS_GENERAL", unlockedDoors));
            } else {
                reply(this, this.t("FEEDBACK_DOORS_ALL_LOCKED"));
            }

        } else {
            reply(this, getErrorMessage(this, r.statusCode));
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending getDoorsHandler()");
}

const getLocationHandler = function () {
    console.info("Starting getLocationHandler()");

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    let request = client.getLocation();
    request.then((r) => {
        const location = carModel.location(r.data);
        if (location && r.statusCode == 200) {
            return GoogleMapsClient.getAddress(location.latitude, location.longitude);
        } else {
            reply(this, getErrorMessage(this, r.statusCode));
            return;
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
    }).then((city) => {
        if (city) {
            reply(this, this.t("FEEDBACK_POSITION", city));
        } else {
            reply(this, this.t("FEEDBACK_COORDINATES", location.latitude, location.longitude));
        }
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending getLocationHandler()");
}

const checkEnoughFuelHandler = function () {
    console.info("Starting checkEnoughFuelHandler()");

    const client = new MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const destinationSlot = this.event.request.intent.slots.destination;
    const city = destinationSlot.value;

    var distance = 0;
    client.getLocation().then((r) => {
        const location = carModel.location(r.data);
        if (location && r.statusCode == 200) {
            return GoogleMapsClient.getDistance(location.latitude, location.longitude, city);
        } else {
            reply(this, getErrorMessage(this, r.statusCode));
            return;
        }
    }).catch((e) => {
        console.log(e);
        reply(this, this.t("ERROR_DISTANCE", city));
        return;
    }).then((dist) => {
        if (dist) {
            console.log(dist);
            distance = dist;
            return client.getStateOfCharge();
        } else {
            reply(this, this.t("FEEDBACK_COORDINATES", location.latitude, location.longitude));
            return;
        }
    }).catch((e) => {
        console.log(e);
        reply(this, this.t("ERROR_DISTANCE", city));
        return;
    }).then((r) => {
        const chargeLevel = carModel.stateOfCharge(r.data);
        const distanceComma = distance.substring(0, distance.indexOf(" "));
        const distanceString = distanceComma.replace(",", "");
        const distanceInt = parseInt(distanceString);
        const maxRange = 517;
        const remainingRange = Math.floor(maxRange * chargeLevel / 100);
        const chargeTimes = Math.ceil((distanceInt - remainingRange) / maxRange);

        var speechOutput = this.t("FEEDBACK_DISTANCE", city, distance) + this.t("FEEDBACK_CHARGE", chargeLevel, remainingRange);
        if (remainingRange >= distanceInt) {
            speechOutput += this.t("FEEDBACK_CHARGE_ENOUGH");
        } else if (maxRange >= distanceInt) {
            speechOutput += this.t("FEEDBACK_CHARGE_NEED_CHARGE");
        } else if (chargeTimes >= 10) {
            speechOutput += this.t("FEEDBACK_CHARGE_TOO_FAR");
        } else if (chargeTimes == 1) {
            speechOutput += this.t("FEEDBACK_CHARGE_ONE_CHARGE");
        } else {
            speechOutput += this.t("FEEDBACK_CHARGE_CHARGETIMES", chargeTimes);
        }
        reply(this, speechOutput);
    }).catch((e) => {
        reply(this, this.t("ERROR"));
        console.log(e);
    });

    console.info("Ending checkEnoughFuelHandler()");
}

/*
    All Handlers for Amazon Built In Events and Intents
*/

const newSessionRequestHandler = function () {
    console.info("Starting newSessionRequestHandler()");

    const token = this.event.session.user.accessToken;
    if (!token) {
        this.emit(":tell", this.t("TOKEN_INVALID"));
        return;
    }

    const client = new MercedesClient(this.event.session.user.accessToken);
    let request = client.getCarInfo();
    request.then((r) => {
        const info = carModel.carInfo(r.data);
        if (!info.id || !info.licenseplate || r.statusCode != 200) {
            this.emit(":tell", getErrorMessage(this, error, this.t("COULD_NOT_CONNECT_TRY_AGAIN")));
        } else {
            this.attributes['carID'] = info.id;
            this.attributes['licenseplate'] = info.licenseplate;
            if (this.event.request.type === Events.LAUNCH_REQUEST) {
                this.emit(Events.LAUNCH_REQUEST);
            } else if (this.event.request.type === "IntentRequest") {
                this.emit(this.event.request.intent.name);
            }
        }
    }).catch((e) => {
        console.log(e);
        this.emit(":tell", getErrorMessage(this, error, this.t("COULD_NOT_CONNECT_TRY_AGAIN")));
    });

    console.info("Ending newSessionRequestHandler()");
};

const launchRequestHandler = function () {
    console.info("Starting launchRequestHandler()");
    this.attributes['launched'] = true;
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
    this.emit(":tell", this.t("GOODBYE"));
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
