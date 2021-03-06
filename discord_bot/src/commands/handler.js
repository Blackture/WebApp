const botStop = require('./stop');
const clear = require('./clear');
const { forbiddenWords } = require("./../secrets/config");
const Discord = require('discord.js');
const { Warn } = require("./../Warning")

function execute(command, message, client) {
    if (command === 'stop') {
        botStop(message, client);
    }
    else if (command === 'clear') {
        clear(message, client);
    }
}

function censorer(message, client) {
    var check = false;

    forbiddenWords.forEach((value) => {
        if (!check) {
            if (message.content.includes(value)) {
                check = true;
                var count = Warn(message.author);
                const embed = new Discord.MessageEmbed()
                    .setTitle(":skull_crossbones: Please be more polite!")
                    .setColor('0xff0000')
                    .setDescription((count > 1) ? `${message.author.username} you have ${count} warnings!` : `${message.author.username} you have ${count} warning!`)
                    .setTimestamp(Date.now)
                    .setAuthor(client.user.tag) //and this its profile pic)
                    //.setImage()
                    .setThumbnail(client.user.avatarUrl);
                message.channel.send(embed);
                message.delete();
                return;
            }
        }
    })
}

exports.execute = execute;
exports.censorer = censorer;