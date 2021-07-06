function botStopViaWebInterface() {
    try {
        var isOn = require('../bot').isOn;
        if (isOn) {
            isOn = false;
            const client = require('../bot').client;
            client.destroy();
        }
    } catch (error) {

    }
    return;
}

module.exports = botStopViaWebInterface;