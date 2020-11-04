const Discord = require("discord.js");

function botStop(msg, client) {
    if (msg.author.tag === 'Blackture#4509') {
        const embed = new Discord.MessageEmbed()
        .setTitle(":white_check_mark: Success")
        .setColor('0x00ff44')
        .setDescription("Deleted " + (int - 1).toString() + " message(s).")
        .setTimestamp(Date.now)
        .setAuthor(client.user.tag) //and this its profile pic)
        .addField("Command", "clear")
        //.setImage()
        .setThumbnail(client.user.avatarUrl);
        msg.channel.send(embed)   
        .then(m => {client.destroy()})
        .then(m => {console.log("Shutting down the discord bot.")});
        break;
    }
  }

module.exports = botStop;