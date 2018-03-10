'use strict';

/*
    This file contains all the intents of the Alexa-Skill.
    If the names of the intents change, they only have to be modified in this file.
*/

// Custom Intents
const GET_FUEL_LEVEL = "GetFuelLevelIntent";
const GET_LICENSE_PLATE = "GetLicensePlateIntent";

// Amazon built-in intents.
const AMAZON_HELP = "AMAZON.HelpIntent";
const AMAZON_CANCEL = "AMAZON.CancelIntent";
const AMAZON_STOP = "AMAZON.StopIntent";

module.exports = {
    "GET_FUEL_LEVEL": GET_FUEL_LEVEL,
    "GET_LICENSE_PLATE": GET_LICENSE_PLATE,
    "AMAZON_HELP": AMAZON_HELP,
    "AMAZON_CANCEL": AMAZON_CANCEL,
    "AMAZON_STOP": AMAZON_STOP
};