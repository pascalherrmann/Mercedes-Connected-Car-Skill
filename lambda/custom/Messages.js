'use strict';

/*
    This file contains all speech assets.
    If Alexa should say different things, it only has to be modified here.
*/

const WELCOME = "Welcome to your Mercedes-Benz Connected Car Skills!";
const WHAT_DO_YOU_WANT = "What can I do for you?";
const GOODBYE = 'Goodbye!';
const STOP = "There is nothing to stop. Did you mean to ask something else?";
const HELP_MESSAGE = 'This skill lets you interact with your Mercedes-Benz. For example, try to ask for the fuel level!';
const HELP_REPROMPT = 'What can I help you with?';
const HELP = "You can use this skill by asking something like: whats my address?";
const UNHANDLED = "This skill doesn't support that. Please ask something else.";
const ERROR = "Uh Oh. Looks like something went wrong.";

module.exports = {
    "WELCOME": WELCOME,
    "WHAT_DO_YOU_WANT": WHAT_DO_YOU_WANT,
    "GOODBYE": GOODBYE,
    "STOP": STOP,
    "HELP_MESSAGE": HELP_MESSAGE,
    "HELP_REPROMPT": HELP_REPROMPT,
    "HELP": HELP,
    "UNHANDLED": UNHANDLED,
    "ERROR": ERROR
};