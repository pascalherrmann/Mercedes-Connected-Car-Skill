'use strict';

const Alexa = require('alexa-sdk');
const RestHelper = require('rest-helper');


const APP_ID = undefined;

const STOP_MESSAGE = 'Goodbye!';
const HELP_MESSAGE = 'This skill lets you interact with your Mercedes. For example, try to ask for the fuel level!';
const HELP_REPROMPT = 'What can I help you with?';

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('AMAZON.HelpIntent');
    },
    'GetFuelLevelIntent': function () {
        const speechOutput = "Soon you will be able to ask for the fuel level of your Mercedes-Benz!";

        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'GetLicensePlateIntent': function () {

        const self = this
        const token = self.event.session.user.accessToken;
        
        getCars(token, function (error, result) {

            if (error == null && result != null) {
                self.response.speak("Your License Plate ist " + result[0].licenseplate);
            } else {
                self.response.speak("Sorry, I could not find your cars!");
            }
            
            self.emit(':responseReady');
            
        });

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};


function getCars(token, callback) {

    var options = {
        host: 'api.mercedes-benz.com',
        port: 443,
        path: '/experimental/connectedvehicle/v1/vehicles',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    RestHelper.getJSON(options, function (statusCode, result) {

        if (statusCode == 200 && result != null) {
            callback(null, result);
        } else {
            callback(statusCode, result);
        }

    })

}