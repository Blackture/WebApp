function botStopViaWebInterface() {
    const client = require('../bot');
    client.destroy();
    return;
}

module.exports = botStopViaWebInterface;