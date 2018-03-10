'use strict';

// Internal imports
const MercedesClient = require('./MercedesClientSimple');
const Intents = require('./Intents');
const Events = require('./Events');
const Messages = require('./Messages');

/*
    All Handlers for Custom Events and Intents
*/

function getErrorMessage(error, standardText) {
    var speechOutput;

    switch (error) {
        case 403:
            speechOutput = "There was a permission problem. Please try to re-link your Mercedes account!";
        case 408:
            speechOutput = "I could not connect to you car, because the simulator is not running at the moment!";
            break;
        case 429:
            speechOutput = "The quota limit is exceeded. Please try again in a minute!";
            break;
        case 500:
            speechOutput = "There was an internal problem on the Mercedes API!"
            break;
        default:
            speechOutput = standardText;
    }

    return speechOutput;
}

const getFuelLevelHandler = function () {
    console.info("Starting getFuelLevelHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken);
    const self = this;
    client.getFuel(function (error, response) {
        if (!error && response.fuellevelpercent.value != null) {
            var speechOutput = "There are " + response.fuellevelpercent.value + " liters of fuel in your Mercedes!";
            self.response.speak(speechOutput);
        } else {
            const speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.response.speak(speechOutput);
        }
        self.emit(':responseReady');
    });

    console.info("Ending getFuelLevelHandler()");
}

const getLicensePlateHandler = function () {
    console.info("Starting getLicensePlateHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken);
    const self = this;
    client.getCars(function (error, response) {
        if (!error && response != null) {
            self.response.speak("Your Mercedes-Benz License Plate is " + response[0].licenseplate);

            self.emit(':responseReady');
        } else {
            const speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.response.speak(speechOutput);
        }

        self.emit(':responseReady');
    });

    console.info("Ending getLicensePlateHandler()");
}

const getMilesHandler = function () {
    /*
        const speechOutput = "Soon, I will be able to tell you the odometer-value of your Mercedes!";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    */
    console.info("Starting getMilesHandler()");

    const client = new MercedesClient.MercedesClient(this.event.session.user.accessToken);
    const self = this;
    client.getMiles(function (error, response) {
        if (!error && response != null) {

            self.response.speak("Your Mercedes-Benz License Plate is " + response[0].licenseplate);

            self.emit(':responseReady');
        } else {
            const speechOutput = getErrorMessage(error, "Unfortunately, I could not connect to your car!");
            self.response.speak(speechOutput);
        }

        self.emit(':responseReady');
    });

    console.info("Ending getMilesHandler()");
}

/*
    All Handlers for Amazon Built In Events and Intents
*/

const newSessionRequestHandler = function () {
    console.info("Starting newSessionRequestHandler()");

    if (this.response.sessionAttributes != null) {
        this.response.sessionAttributes.count++;
    } else {
        this.response.sessionAttributes = {
            'count': 1
        }
    }

    if (this.event.request.type === Events.LAUNCH_REQUEST) {
        this.emit(Events.LAUNCH_REQUEST);
    } else if (this.event.request.type === "IntentRequest") {
        this.emit(this.event.request.intent.name);
    }

    console.info("Ending newSessionRequestHandler()");
};

const launchRequestHandler = function () {
    this.response.sessionAttributes = {
        "jo": "jo"
    };
    console.info("Starting launchRequestHandler()");
    this.emit(":ask", Messages.WELCOME + Messages.WHAT_DO_YOU_WANT, Messages.WHAT_DO_YOU_WANT);
    console.info("Ending launchRequestHandler()");
    //this.emit('AMAZON.HelpIntent');
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

    //const speechOutput = HELP_MESSAGE;
    //const reprompt = HELP_REPROMPT;
    //this.response.speak(speechOutput).listen(reprompt);
    //this.emit(':responseReady');
};

const amazonCancelHandler = function () {
    console.info("Starting amazonCancelHandler()");
    this.emit(":tell", Messages.GOODBYE);
    console.info("Ending amazonCancelHandler()");
    //this.response.speak(STOP_MESSAGE);
    //this.emit(':responseReady');
};

const amazonStopHandler = function () {
    console.info("Starting amazonStopHandler()");
    this.emit(":ask", Messages.STOP, Messages.STOP);
    console.info("Ending amazonStopHandler()");
    //this.response.speak(STOP_MESSAGE);
    //this.emit(':responseReady');
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

module.exports = handlers;
