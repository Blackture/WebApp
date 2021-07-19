async function registerCommands(client) {

    client.api.applications(client.user.id).guilds("736536601525616651").commands.post({
        data: {
            "name": "clear",
            "description": "Clears messages in a channel",
            "options": [
              {
                "type": 4,
                "name": "amount",
                "description": "The desired number of messages to be deleted.",
                "required": true
              }
            ]
          }
    })
}

module.exports = { registerCommands: registerCommands }