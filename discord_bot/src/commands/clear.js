const Discord = require("discord.js");
var int = 0;

function clear(msg, client) {
    var message = msg.content.trim();
    var messageSplit = message.split(' ');
    if (messageSplit.length > 2 && messageSplit.length < 2) {
        const embed = new Discord.MessageEmbed()
            .setTitle(":skull_crossbones: Error")
            .setColor('0xff0000')
            .setDescription("Too many arguments")
            .setTimestamp(Date.now)
            .setFooter("For more help: .help")
            .setAuthor(client.user.tag) //and this its profile pic)
            .addField("Command", "clear")
            //.setImage()
            .setThumbnail(client.user.avatarUrl);
        msg.channel.send(embed);
    }
    else {
        int = parseInt(messageSplit[1], 10) + 1;
        msg.channel.bulkDelete(int)
            .then(() => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(":white_check_mark: Success")
                    .setColor('0x00ff44')
                    .setDescription("Deleted " + (int - 1).toString() + " message(s).")
                    .setTimestamp(Date.now)
                    .setAuthor(client.user.tag) //and this its profile pic)
                    .addField("Command", "clear")
                    //.setImage()
                    .setThumbnail(client.user.avatarUrl);
                msg.channel.send(embed);
                return;
            })
            .catch((err) => {
                console.log(err.message);
                const embed = new Discord.MessageEmbed()
                    .setTitle(":skull_crossbones: Error")
                    .setColor('0xff0000')
                    .setDescription(err.message)
                    .setTimestamp(Date.now)
                    .setFooter("For more help: .help")
                    .setAuthor(client.user.tag) //and this its profile pic)
                    .addField("Command", "clear")
                    //.setImage()
                    .setThumbnail(client.user.avatarUrl);
                msg.channel.send(embed);
                return;
            });
    }
}

module.exports = clear;