'use strict';

// Internal imports
const MercedesClient = require('./MercedesClientSimple');
const GoogleMapsClient = require('./GoogleMapsClient');
const Intents = require('./Intents');
const Events = require('./Events');
const Messages = require('./Messages');

/*
    All Handlers for Custom Events and Intents
*/

function getErrorMessage(error, standardText) {

    switch (error) {
        case 403:
            return Messages.ERROR_403;
        case 408:
            return Messages.ERROR_408;
        case 429:
            return Messages.ERROR_429;
        case 500:
            return Messages.ERROR_500;
        default:
            return standardText;
    }

}

function handleLock(locking, self) {

    const client = new MercedesClient.MercedesClient(self.event.session.user.accessToken, self.attributes['carID']);
    client.postDoors(locking, function (error, response) {
        var speechOutput = "";
        if (!error && response.status == "INITIATED") {
            speechOutput = locking ? "Applied Locking Door Command!" : "Applied Unlocking Door Command!";
        } else {
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
        }
        self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
    });

}

const getDoorsHandler = function () {
    console.info("Starting getDoorsHandler()");
    //this.emit(":tell", this.t('SAY_HELLO_MESSAGE', "Pascal"));

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken, this.attributes['carID']);
    const self = this;
    client.getDoors(function (error, response) {
        var speechOutput = "The ";
        if (!error && response) {

            const doors = ["doorlockstatusfrontleft", "doorlockstatusfrontright", "doorlockstatusrearright", "doorlockstatusrearleft"];
            const doornames = ["Front Left Door", "Front Right Door", "Rear Right Door", "Rear Left Door"];

            var first = true;
            for (let i = 0; i < doors.length; i++) {
                if (response[doors[i]].value == "UNLOCKED") {
                    if (first) {
                        first = false;
                    } else {
                        speechOutput += ", ";
                    }
                    speechOutput = speechOutput + doornames[i];
                }
            }

            speechOutput += " are unlocked!";
            if (speechOutput == "The  are unlocked!") {
                speechOutput = "All doors are locked!";
            }

        } else {
            console.log(error);
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
        }
        self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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
                    speechOutput = "The car's position is: " + city;
                } else {
                    speechOutput = "The car's position is: Longitude=" + response.latitude.value + ", Latitude=" + response.longitude.value, +"!";
                }
                self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
            });

        } else {
            console.log(error);
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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
            speechOutput = "There are " + response.fuellevelpercent.value + " liters of fuel in your Mercedes!";
        } else {
            console.log(error);
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
        }
        self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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

                            const maxRange = 417;
                            const remainingRange = Math.floor(maxRange * chargeLevel / 100);
                            const chargeTimes = Math.ceil((distanceInt - remainingRange) / maxRange);



                            speechOutput = "The distance between your current location and " + city + " is " + distance + "! Your Mercedes has a state of charge of " + chargeLevel + "%, with an estimated range of " + remainingRange + "km!";

                            if (remainingRange >= distanceInt) {
                                speechOutput += " Awesome, with your current charge level, you can make the whole route! Have a fun trip!";
                            } else if (maxRange >= distanceInt) {
                                speechOutput += " That's not enough! You should charge your car! Than you can make the whole trip with one charge!";
                            } else if (chargeTimes >= 10) {
                                speechOutput += " Well... maybe you should thing about taking a plane!";
                            } else if (chargeTimes == 1) {
                                speechOutput += " You'll only have to charge your car one time during the trip!";
                            } else {
                                speechOutput += " You will have to charge your car " + chargeTimes + " times!";
                            }

                        } else {
                            console.log(error);
                            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
                        }
                        self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
                    });

                } else {
                    console.log(err);
                    console.log("ERROR COULDNT FINT!")
                    self.emit(":ask", "There was a problem finding the distance to " + city + "!", Messages.WHAT_DO_YOU_WANT);
                }

            });

        } else {
            console.log(error);
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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
            speechOutput = "Your Mercedes-Benz License Plate is " + response[0].licenseplate;
        } else {
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
        }

        self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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

            speechOutput = "There are " + total + " km on the odometer!" +
                " Since the last reset, you've driven " + sinceReset + " km" +
                " and since start " + current + "!";
            const cardTitle = "Your Car's Odometer Values:"
            const cardContent = `\n\nTotal: ${total}km\n\nSince last reset: ${sinceReset}km\n\nSince start: ${current}km`;
            self.emit(':askWithCard', speechOutput, Messages.WHAT_DO_YOU_WANT, cardTitle, cardContent, imageObj);

        } else {
            console.log(error);
            speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.emit(":ask", speechOutput, Messages.WHAT_DO_YOU_WANT);
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
            self.emit(":tell", "I could not connect to your car! Please try again!");
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
    this.emit(":ask", Messages.WELCOME + Messages.WHAT_DO_YOU_WANT, Messages.WHAT_DO_YOU_WANT);
    console.info("Ending launchRequestHandler()");
};

const sessionEndedRequestHandler = function () {
    console.info("Starting sessionEndedRequestHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending sessionEndedRequestHandler()");
};

const unhandledRequestHandler = function () {
    console.info("Starting unhandledRequestHandler()");
    this.emit(":ask", Messages.UNHANDLED, Messages.UNHANDLED);
    console.info("Ending unhandledRequestHandler()");
};

const amazonHelpHandler = function () {
    console.info("Starting amazonHelpHandler()");
    this.emit(":ask", Messages.HELP, Messages.HELP);
    console.info("Ending amazonHelpHandler()");
};

const amazonCancelHandler = function () {
    console.info("Starting amazonCancelHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending amazonCancelHandler()");
};

const amazonStopHandler = function () {
    console.info("Starting amazonStopHandler()");
    this.emit(":ask", Messages.STOP, Messages.STOP);
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
