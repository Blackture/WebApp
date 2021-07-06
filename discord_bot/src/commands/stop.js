const Discord = require("discord.js");

function botStop(msg, client) {
  
    if (msg.author.tag === 'Blackture#4509') {
        client.isOn = false;
        const embed = new Discord.MessageEmbed()
        .setTitle(":white_check_mark: Success")
        .setColor('0x00ff44')
        .setDescription("Shutting down discord bot")
        .setTimestamp(Date.now)
        .setAuthor(client.user.tag) //and this its profile pic)
        .addField("Command", "stop")
        //.setImage()
        .setThumbnail(client.user.avatarUrl);
        msg.channel.send(embed)
        .then(m => {console.log("Shutting down the discord bot.")})   
        .then(m => {client.destroy()});
        return;
    }
  }

module.exports = botStop;