const {
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Send an embed in a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select the text-channel for the embed")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title of the embed")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Desctiption of the embed")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Color of the embed")
        .setMinLength(6)
        .setMaxLength(6)
    )
    .addAttachmentOption((option) =>
      option.setName("image").setDescription("Image of the embed")
    )
    .addStringOption((option) =>
      option.setName("footer").setDescription("Footer of the embed")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    if (interaction.options.getAttachment("image") == null) {
      interaction.options.getChannel("channel").send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.options.getString("title") || " "}`)
            .setDescription(
              `${interaction.options.getString("description") || " "}`
            )
            .setColor(`${interaction.options.getString("color") || "Default"}`)
            .setFooter({
              text: `${interaction.options.getString("footer") || " "}`,
            }),
        ],
      });
    } else {
      interaction.options.getChannel("channel").send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.options.getString("title") || " "}`)
            .setDescription(
              `${interaction.options.getString("description") || " "}`
            )
            .setImage(
              `${interaction.options.getAttachment("image").attachment}`
            )
            .setColor(`${interaction.options.getString("color") || "Default"}`)
            .setFooter({
              text: `${interaction.options.getString("footer") || " "}`,
            }),
        ],
      });
    }
  },
};
