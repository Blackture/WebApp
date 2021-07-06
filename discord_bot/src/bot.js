const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix, commandArray } = require("./secrets/config");
const handler = require("./commands/handler");
var isOn = false;

client.on('message', msg => {
  commandArray.forEach(function (command){
    if (msg.content.startsWith(prefix + command)) {
      handler.execute(command, msg, client);
    }
  })
  handler.censorer(msg, client);
});



client.on('ready', () => {
  console.log(`Logged in as \"${client.user.tag}!\"`);
  client.user.setActivity('the dark dispersion', { type: 'WATCHING' });
  isOn = true;
});

client.login(token);

module.exports = { client, isOn };