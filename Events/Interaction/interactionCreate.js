const { Events, CommandInteraction } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply(`${client.emotes.error} **Command not found**`);
    }

    command.execute(interaction, client);
  },
};
