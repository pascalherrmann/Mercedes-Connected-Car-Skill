'use strict';

const Alexa = require('alexa-sdk');

// Local imports
const Handlers = require('./Handlers');

// Constants
const APP_ID = "amzn1.ask.skill.6505aba2-e55a-4446-9f26-c5041262cb6b";

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(Handlers);
    alexa.execute();
};
