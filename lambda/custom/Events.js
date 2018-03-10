'use strict';

/*
    This file contains all events.
    If an event name changes, it only has to be modified here.
*/

const NEW_SESSION = "NewSession";
const LAUNCH_REQUEST = "LaunchRequest";
const SESSION_ENDED = "SessionEndedRequest";
const UNHANDLED = "Unhandled";

module.exports = {
    "NEW_SESSION": NEW_SESSION,
    "LAUNCH_REQUEST": LAUNCH_REQUEST,
    "SESSION_ENDED": SESSION_ENDED,
    "UNHANDLED": UNHANDLED
};