const { Events, ButtonInteraction } = require("discord.js");
const DB = require("../../Schemas/buttonDB");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const customId = interaction.customId;
    const buttonsData = await DB.findOne({
      GuildID: interaction.guild.id,
      ChannelID: interaction.channel.id,
      MessageID: interaction.message.id,
    });

    if (!buttonsData || !buttonsData.Buttons) return;
    const clickedButton = buttonsData.Buttons.find(
      (button) => button.CustomID === customId
    );
    if (!clickedButton) return;

    const roleId = clickedButton.RoleID;
    if (!roleId) return;

    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) return;

    const member = interaction.member;
    if (!member) return;

    try {
      if (clickedButton.Type === "normal") {
        const hasRole = member.roles.cache.has(role.id);
        if (hasRole) {
          await member.roles.remove(role);
          interaction.reply({
            content: `Role ${role} removed successfully.`,
            ephemeral: true,
          });
        } else {
          await member.roles.add(role);
          interaction.reply({
            content: `Role ${role} added successfully.`,
            ephemeral: true,
          });
        }
      } else {
        const hasRole = member.roles.cache.has(role.id);
        if (hasRole) {
          await member.roles.add(role);
          interaction.reply({
            content: `You already have ${role} role.`,
            ephemeral: true,
          });
        } else {
          await member.roles.add(role);
          interaction.reply({
            content: `Role ${role} added successfully.`,
            ephemeral: true,
          });
        }
      }
    } catch (err) {
      console.log(err);
      interaction.reply({
        content: "An error occurred while adding the role.",
        ephemeral: true,
      });
    }
  },
};
