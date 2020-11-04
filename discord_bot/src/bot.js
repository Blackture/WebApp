const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix, commandArray } = require("./secrets/config");
const execute = require("./commands/handler");

client.on('message', msg => {
  commandArray.forEach(function (command){
    if (msg.content.startsWith(prefix + command)) {
      execute(command, msg, client);
    }
  })
});



client.on('ready', () => {
  console.log(`Logged in as \"${client.user.tag}!\"`);
  client.user.setActivity('the dark dispersion', { type: 'WATCHING' });
});

client.login(token);

module.exports = client;