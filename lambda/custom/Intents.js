'use strict';

/*
    This file contains all the intents of the Alexa-Skill.
    If the names of the intents change, they only have to be modified in this file.
*/

// Custom Intents
const GET_FUEL_LEVEL = "GetFuelLevelIntent";
const GET_LICENSE_PLATE = "GetLicensePlateIntent";
const GET_MILES = "GetMilesIntent";
const LOCK_DOORS = "LockDoorIntent";
const UNLOCK_DOORS = "UnlockDoorIntent";
const GET_DOORS = "GetDoorStatusIntent";
const GET_LOCATION = "GetLocationIntent";
const CHECK_ENOUGH_FUEL = "CheckEnoughFuelIntent";

// Amazon built-in intents.
const AMAZON_HELP = "AMAZON.HelpIntent";
const AMAZON_CANCEL = "AMAZON.CancelIntent";
const AMAZON_STOP = "AMAZON.StopIntent";

module.exports = {
    "GET_FUEL_LEVEL": GET_FUEL_LEVEL,
    "GET_LICENSE_PLATE": GET_LICENSE_PLATE,
    "GET_MILES": GET_MILES,
    "AMAZON_HELP": AMAZON_HELP,
    "AMAZON_CANCEL": AMAZON_CANCEL,
    "AMAZON_STOP": AMAZON_STOP,
    "LOCK_DOORS": LOCK_DOORS,
    "UNLOCK_DOORS": UNLOCK_DOORS,
    "GET_DOORS": GET_DOORS,
    "GET_LOCATION": GET_LOCATION,
    "CHECK_ENOUGH_FUEL": CHECK_ENOUGH_FUEL
};
