const botStop = require('./stop');
const clear = require('./clear');

function execute(command, message, client){
    if (command === 'stop'){
        botStop(message, client);
    }
    else if (command === 'clear'){
        clear(message, client);
    }
}

module.exports = execute;