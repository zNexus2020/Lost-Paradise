const {
  Client,
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
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
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    let channel = interaction.options.getChannel("channel");
    let title = interaction.options.getString("title");
    let description = interaction.options.getString("description");
    let color = interaction.options.getString("color");
    let image = interaction.options.getAttachment("image");
    let footer = interaction.options.getString("footer");

    description = description.replace(/\\n/g, "\n");

    let checkColor = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
    if (!checkColor) {
      await interaction.reply({
        content: "invalid embed color, embed sent anyway with color Deafult",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "embed sent",
        ephemeral: true,
      });
    }
    try {
      if (image == null) {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${title || " "}`)
              .setDescription(`${description || " "}`)
              .setColor(`${checkColor ? color : "Default"}`)
              .setTimestamp()
              .setFooter({ text: `${footer || " "}` }),
          ],
        });
      } else {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${title || " "}`)
              .setDescription(`${description || " "}`)
              .setColor(`${checkColor ? color : "Default"}`)
              .setImage(`${image.attachment}`)
              .setTimestamp()
              .setFooter({ text: `${footer || " "}` }),
          ],
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
