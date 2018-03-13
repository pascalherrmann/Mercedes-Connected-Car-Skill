'use strict';

const languageStrings = {
    'en-US': {
        'translation': {
            'SAY_HELLO_MESSAGE': 'Hello %s, how are you?',
            'FEEDBACK_LOCKING': 'Sure! Locking your Mercedes-Benz!',
            'FEEDBACK_UNLOCKING': 'Sure! Unlocking your Mercedes-Benz!',
            'FEEDBACK_LICENSE_PLATE': 'Your Mercedes-Benz licenseplate is %s.',
            'FEEDBACK_POSITION': "The car's position is %s.",
            'FEEDBACK_ODOMETER': "There are %s km on the odometer! Since the last reset, you've driven %s km and since start %s!",
            'FEEDBACK_ODOMETER_CARD_TITLE': "Your Car's Odometer Values:",
            'FEEDBACK_ODOMETER_CARD_CONTENT': "\n\nTotal: %skm\n\nSince last reset: %skm\n\nSince start: %skm",
            'FEEDBACK_COORDINATES': "The car's position is: Latitude=%s, Longitude=%s.",
            'FEEDBACK_FUEL_LEVEL': "At the moment, there are %s liters of fuel in your car.",
            'FEEDBACK_DISTANCE': "The distance between your current location and %s is %s. ",
            'FEEDBACK_DOORS_ALL_LOCKED': "All doors are locked! ",
            'FEEDBACK_DOORS_GENERAL': "The doors %s are unlocked!",
            'FEEDBACK_CHARGE': "Your Mercedes-Benz has a state of charge of %s %%, which is enough for an estimated range of %s km. ",
            'FEEDBACK_CHARGE_ENOUGH': "Awesome, with your current charge level, you can make the whole route! Have a fun trip!",
            'FEEDBACK_CHARGE_NEED_CHARGE': "That's not enough! You should charge your car! Than you can make the whole trip with one charge!",
            'FEEDBACK_CHARGE_TOO_FAR': "Well... maybe you should thing about taking a plane!",
            'FEEDBACK_CHARGE_ONE_CHARGE': "You'll only have to charge your car one time during the trip!",
            'FEEDBACK_CHARGE_CHARGETIMES': "You will have to charge your car %s times!",
            'WELCOME': 'Welcome to your Mercedes-Benz Connected Car Skill! ',
            'WHAT_DO_YOU_WANT': 'What can I do for you? ',
            'GOODBYE': 'Goodbye! ',
            'STOP': 'There is nothing to stop. Did you mean to ask something else? ',
            'HELP_MESSAGE': 'This skill lets you interact with your Mercedes-Benz. For example, try to ask for the fuel level! ',
            'HELP_REPROMPT': 'What can I help you with? ',
            'HELP': 'You can use this skill by asking something like: what is the fuel level?',
            'UNHANDLED': "This skill doesn't support that. Please ask something else. ",
            'ERROR': 'Uh Oh. Looks like something went wrong. ',
            'ERROR_403': 'There was a permission problem. Please try to re-link your Mercedes account!',
            'ERROR_408': 'I could not connect to you car, because the simulator is not running at the moment! Please start the simulator and try again!',
            'ERROR_429': 'The quota limit is exceeded. Please try again in a minute!',
            'ERROR_500': 'There was an internal problem on the Mercedes API!',
            'ERROR_DISTANCE': 'Could not find a route to %s!',
            'COULD_NOT_CONNECT_TRY_AGAIN': 'I could not connect to your car! Please try again!',
            'DOOR_FRONT_LEFT': 'Front Left',
            'DOOR_FRONT_RIGHT': 'Front Right',
            'DOOR_REAR_LEFT': 'Rear Left',
            'DOOR_REAR_RIGHT': 'Rear Right',
            'AND': 'and',
            'TOKEN_INVALID': 'Your security token is invalid. Please link this skill to your Mercedes-Account.'
        }
    },
    'de-DE': {
        'translation': {
            'SAY_HELLO_MESSAGE': 'Hallo %s, wie geht es Dir?',
            'FEEDBACK_LOCKING': 'Dein Mercedes-Benz wird gesperrt!',
            'FEEDBACK_UNLOCKING': 'Dein Mercedes-Benz wird entsperrt!',
            'FEEDBACK_LICENSE_PLATE': 'Das Nummernschild Deines Mercedes ist %s.',
            'FEEDBACK_POSITION': "Die aktuelle Position des Autos ist: %s.",
            'FEEDBACK_COORDINATES': "Die aktuelle Position des Autos ist: Latitude=%s, Longitude=%s.",
            'FEEDBACK_ODOMETER': "Der Odometerstand beträgt %s km. Seit dem letzten Reset bist Du %s km gefahren, und seit dem aktuellen Start %s.",
            'FEEDBACK_ODOMETER_CARD_TITLE': "Die aktuellen Odometer-Werte:",
            'FEEDBACK_ODOMETER_CARD_CONTENT': "\n\nInsgesamt: %skm\n\nSeit letztem Reset: %skm\n\nSeit aktuellem Start: %skm",
            'FEEDBACK_FUEL_LEVEL': "Aktuell befinden sich %s Liter Benzin in Deinem Mercedes-Benz.",
            'FEEDBACK_DISTANCE': "Die Strecke zwischen Deinem aktuellem Standort und %s beträgt %s.",
            'FEEDBACK_DOORS_ALL_LOCKED': "Alle Türen sind verriegelt!",
            'FEEDBACK_DOORS_GENERAL': "Die Türen %s sind entriegelt!",
            'FEEDBACK_CHARGE': "Dein Mercedes-Benz ist zu %s %% geladen - das reicht für eine Strecke von %s km. ",
            'FEEDBACK_CHARGE_ENOUGH': " Perfekt! Der aktuelle Ladestand reicht für die ganze Strecke! Gute Fahrt!",
            'FEEDBACK_CHARGE_NEED_CHARGE': "Das reicht nicht ganz aus! Du solltest Deinen Mercedes laden, um die ganze Strecke mit einer Ladung zu fahren!",
            'FEEDBACK_CHARGE_TOO_FAR': "Wow... vielleicht solltest Du lieber ein Flugzeug nehmen!",
            'FEEDBACK_CHARGE_ONE_CHARGE': "Du musst Deinen Mercedes nur einmal während der Fahrt laden!",
            'FEEDBACK_CHARGE_CHARGETIMES': "Du musst Dein Auto %s Mal laden!",
            'WELCOME': 'Willkommen im Mercedes-Benz Connected Car Skill! ',
            'WHAT_DO_YOU_WANT': 'Was kann ich für Dich tun? ',
            'GOODBYE': 'Auf Wiedersehen! ',
            'STOP': 'Aktuell gibt es nichts, das gestoppt werden kann. Meintest Du etwas anderes? ',
            'HELP_MESSAGE': 'Dieser Skill lässt Dich mit Deinem Mercedes-Benz interagieren! Frage nach dem Tank-Level, dem Kilometerstand oder schließe die Türen! ',
            'HELP_REPROMPT': 'Was kann ich für Dich tun? ',
            'HELP': 'Du kannst diesen Skill verwenden, indem du z.B. nach dem Tank-Level, dem Kilometerstand oder dem Nummernschild fragst, oder das Auto abschließen lässt! ',
            'UNHANDLED': "Diese Aktion wird aktuell noch nicht unterstützt. Bitte frage etwas anderes. ",
            'ERROR': 'Uuups! Leider gab es einen Fehler! ',
            'ERROR_403': 'Es gab ein Berechtigungs-Problem! Bitte versuche, deinen Mercedes-Benz-Account erneut zu linken.',
            'ERROR_408': 'Es konnte keine Verbindung zum Auto hergestellt werden, da der Simulator gerade nicht läuft. Bitte starte den Simulator und versuche es erneut!',
            'ERROR_429': 'Das Anfrage-Limit ist gerade erreicht. Bitte versuche es in einer Minute erneut!',
            'ERROR_500': 'Es gab ein internes Problem mit der Mercedes-Benz-API!',
            'ERROR_DISTANCE': 'Es konnte keine Route nach %s gefunden werden!',
            'COULD_NOT_CONNECT_TRY_AGAIN': 'Es konnte keine Verbindung zum Auto aufgebaut werden! Bitte versuche es erneut!',
            'DOOR_FRONT_LEFT': 'Vorne Links',
            'DOOR_FRONT_RIGHT': 'Vorne Rechts',
            'DOOR_REAR_LEFT': 'Hinten Links',
            'DOOR_REAR_RIGHT': 'Hinten Rechts',
            'AND': 'und',
            'TOKEN_INVALID': 'Dein Token ist ungültig. Bitte verlinke diesen Skill mit deinem Mercedes-Account.'
        }
    }
};

module.exports = languageStrings;
