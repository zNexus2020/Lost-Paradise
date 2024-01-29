const { Events, CommandInteraction } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply(`${client.emotes.error} **Command not found**`);
    }

    if (command.inVoiceChannel && !interaction.member.voice.channel) {
      return interaction.reply({
        content: `${client.emotes.error} **You must be in a voice channel!**`,
        ephemeral: true,
      });
    }

    command.execute(interaction, client);
  },
};
