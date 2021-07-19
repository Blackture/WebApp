const Discord = require("discord.js");
var int = 0;

function clear(options, client) {
    try {
        int = options[0];
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
                return embed;
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
                return embed;
            })

    }
    catch (e) {
        console.log(e.message);
        const embed = new Discord.MessageEmbed()
            .setTitle(":skull_crossbones: Error")
            .setColor('0xff0000')
            .setDescription(e.message)
            .setTimestamp(Date.now)
            .setFooter("For more help: .help")
            .setAuthor(client.user.tag) //and this its profile pic)
            .addField("Command", "clear")
            //.setImage()
            .setThumbnail(client.user.avatarUrl);
        return embed;
    }
}

module.exports = clear;