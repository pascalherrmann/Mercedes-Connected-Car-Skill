exports.carInfo = function (obj) {
    try {
        return {
            id: obj[0].id,
            licenseplate: obj[0].licenseplate
        };
    } catch (e) {
        return null;
    }
}

exports.doors = function (obj) {
    try {
        return  [
            {
                value: obj.doorlockstatusfrontleft.value,
                str: "DOOR_FRONT_LEFT"
            },
            {
                value: obj.doorlockstatusfrontright.value,
                str: "DOOR_FRONT_RIGHT"
            },
            {
                value: obj.doorlockstatusrearright.value,
                str: "DOOR_REAR_LEFT"
            },
            {
                value: obj.doorlockstatusrearleft.value,
                str: "DOOR_REAR_RIGHT"
            }
        ];

    } catch (e) {
        return null;
    }
}

exports.location = function (obj) {
    try {
        return {
            longitude: obj.longitude.value,
            latitude: obj.latitude.value,
            heading: obj.heading.value
        };
    } catch (e) {
        return null;
    }
}

exports.odometer = function (obj) {
    try {
        return {
            total: obj.odometer.value,
            reset: obj.distancesincereset.value,
            start: obj.distancesincestart.value
        };
    } catch (e) {
        return null;
    }
}

exports.stateOfCharge = function (obj) {
    try {
        return obj.stateofcharge.value;
    } catch (e) {
        return null;
    }
}

exports.fuel = function (obj) {
    try {
        return obj.fuellevelpercent.value;
    } catch (e) {
        return null;
    }
}

exports.doorFeedback = function (obj) {
    try {
        return obj.status == "INITIATED";
    } catch (e) {
        return null;
    }
}
