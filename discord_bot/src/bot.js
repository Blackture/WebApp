const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix, commandArray, publicKey, applicationId } = require("./secrets/config");
const handler = require("./commands/handler");
const { registerCommands } = require("./commands/registration");
const botStop = require('./commands/stop');
var isOn = false;

client.on('message', msg => {
  commandArray.forEach(function (command) {
    if (msg.content.startsWith(prefix + command)) {
      handler.execute(command, msg, client);
    }
  })
  handler.censorer(msg, client);
});

client.ws.on('INTERACTION_CREATE', async interaction => {

  console.log(interaction.data.name);

  var embed = new Discord.MessageEmbed()
  .setTitle(":skull_crossbones: What's that?!")
  .setColor('0xff0000')
  .setDescription("Stop using non-existent commands!")
  .setTimestamp(Date.now)
  .setAuthor(client.user.tag) //and this its profile pic)
  //.setImage()
  .setThumbnail(client.user.avatarUrl);

  commandArray.forEach(function (command) {
    if (interaction.data.name == command) {
      embed = handler.execute(command, interaction.data.options, client);
    }
  })

  await new Discord.WebhookClient(client.user.id, interaction.token).send(embed);

  /*
  client.api.interactions(interaction.id, interaction.token).callback.post({data: {
    type: 4,
    data: {
      content: ''
    }
  }});
  */
})

client.on('ready', () => {
  console.log(`Logged in as \"${client.user.tag}!\"`);
  client.user.setPresence({
    activity: {
      name: 'the dark dispersion',
      type: 'WATCHING'
    },
    status: 'idle'
  });

  isOn = true;

  registerCommands(client);
});

client.login(token);

module.exports = { client, isOn };