const {
  SlashCommandBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const DB = require("../../Schemas/buttonDB");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Manage buttons in messages")
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("role")
        .setDescription("Manage buttons with roles")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("add")
            .setDescription("Add a button to a message")
            .addStringOption((option) =>
              option
                .setName("text")
                .setDescription("Text that will appear on the button")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("color")
                .setDescription("Select the color of the button")
                .addChoices(
                  { name: "Blue", value: "Primary" },
                  { name: "Grey", value: "Secondary" },
                  { name: "Green", value: "Success" },
                  { name: "Red", value: "Danger" }
                )
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription(
                  "Select the role to assign when the button is clicked"
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("Select the type of the button role")
                .addChoices(
                  { name: "Add/Remove", value: "normal" },
                  { name: "Permanent add", value: "perma-add" }
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("message-link")
                .setDescription(
                  "Paste the message link where you want to add the button"
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("remove")
            .setDescription("Remove a button from a message")
            .addStringOption((option) =>
              option
                .setName("custom-id")
                .setDescription(
                  "The button CustomID (use the list command to find it)"
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("message-link")
                .setDescription(
                  "Paste the message link from which you want to remove the button"
                )
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("list")
            .setDescription("Get the list of all customID buttons in the guild")
        )
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    const SubCommand = interaction.options.getSubcommand();

    let messageLink = null;
    if (SubCommand === "add" || SubCommand === "remove") {
      messageLink = interaction.options.getString("message-link");
      const match = messageLink.match(/\/channels\/(\d+)\/(\d+)\/(\d+)/);
      if (!match) {
        return interaction.reply({
          content: "Invalid message link. Please provide a valid message link.",
          ephemeral: true,
        });
      }
      const [, guildId, channelId, messageId] = match;

      const originalMessage = await client.guilds.cache
        .get(guildId)
        ?.channels.cache.get(channelId)
        ?.messages.fetch(messageId);
      if (!originalMessage)
        return interaction.reply(
          "Invalid message link. Please make sure the provided message link is correct and accessible."
        );

      if (originalMessage.author.id !== client.user.id) {
        return interaction.reply({
          content:
            "Invalid message link. Please make sure that the provided link is a message from me and not from another bot or user.",
          ephemeral: true,
        });
      }

      if (SubCommand === "add") {
        const roleToAdd = interaction.guild?.roles.cache.get(
          interaction.options.getRole("role").id
        );

        const botHighestRolePosition = interaction.guild.members.cache.get(
          client.user.id
        ).roles.highest.position;

        if (botHighestRolePosition <= roleToAdd?.position) {
          return interaction.reply({
            content:
              "I cannot add a button for a role higher than or equal to my highest role.",
            ephemeral: true,
          });
        }

        try {
          const customId = `${messageId}_${Date.now()}`;

          await DB.findOneAndUpdate(
            {
              GuildID: guildId,
              ChannelID: channelId,
              MessageID: messageId,
            },
            {
              $push: {
                Buttons: {
                  CustomID: customId,
                  Label: interaction.options.getString("text"),
                  Style: interaction.options.getString("color"),
                  RoleID: interaction.options.getRole("role"),
                  Type: interaction.options.getString("type"),
                },
              },
            },
            { new: true, upsert: true }
          );

          const buttonsData = (
            await DB.findOne({
              GuildID: guildId,
              ChannelID: channelId,
              MessageID: messageId,
            })
          ).Buttons;

          const buttonGroups = [];
          for (let i = 0; i < buttonsData.length; i += 5) {
            const group = buttonsData.slice(i, i + 5);
            buttonGroups.push(group);
          }

          if (buttonsData.length > 25) {
            return interaction.reply({
              content: "Cannot add more than 25 buttons to a single message.",
              ephemeral: true,
            });
          }

          const allButtons = buttonGroups.map((group) =>
            group.map((button) =>
              new ButtonBuilder()
                .setCustomId(button.CustomID)
                .setLabel(button.Label)
                .setStyle(button.Style)
            )
          );

          await originalMessage.edit({
            embeds: [originalMessage.embeds[0]],
            components: allButtons.map((buttons) =>
              new ActionRowBuilder().addComponents(buttons)
            ),
          });

          interaction.reply({
            content: `Button added to [this message](${messageLink}) with text: \`${interaction.options.getString(
              "text"
            )}\` and type: \`${interaction.options
              .getString("type")
              .toLowerCase()}\``,
            ephemeral: true,
            flags: "SuppressEmbeds",
          });
        } catch (err) {
          console.log(err);
        }
      } else if (SubCommand === "remove") {
        const customId = interaction.options.getString("custom-id");
        try {
          const buttonsDataBefore = (
            await DB.findOne({
              GuildID: guildId,
              ChannelID: channelId,
              MessageID: messageId,
            })
          )?.Buttons;

          const buttonToRemove = buttonsDataBefore.find(
            (button) => button.CustomID === customId
          );
          if (!buttonToRemove) {
            return interaction.reply({
              content:
                "Invalid customId. The specified customId is not found in the database.",
              ephemeral: true,
            });
          }

          const updatedButtonsData = buttonsDataBefore.filter(
            (button) => button.CustomID !== customId
          );

          const buttonGroups = [];
          for (let i = 0; i < updatedButtonsData.length; i += 5) {
            const group = updatedButtonsData.slice(i, i + 5);
            buttonGroups.push(group);
          }

          const allButtonsAfterRemoval = buttonGroups.map((group) =>
            group.map((button) =>
              new ButtonBuilder()
                .setCustomId(button.CustomID)
                .setLabel(button.Label)
                .setStyle(button.Style)
            )
          );
          const updatedButtonComponents = allButtonsAfterRemoval.map(
            (buttons) => new ActionRowBuilder().addComponents(buttons)
          );

          await originalMessage.edit({
            components: updatedButtonComponents,
          });

          await DB.findOneAndUpdate(
            {
              GuildID: guildId,
              ChannelID: channelId,
              MessageID: messageId,
            },
            {
              $pull: {
                Buttons: {
                  CustomID: customId,
                },
              },
            }
          );

          if (updatedButtonsData.length === 0) {
            await DB.findOneAndDelete({
              GuildID: guildId,
              ChannelID: channelId,
              MessageID: messageId,
            });
          }

          interaction.reply({
            content: `Removed button with text: \`${buttonToRemove.Label}\` from [this message](${messageLink})`,
            ephemeral: true,
            flags: "SuppressEmbeds",
          });
        } catch (err) {
          console.log(err);
        }
      }
    } else if (SubCommand === "list") {
      try {
        const guildId = interaction.guild.id;

        const guildButtonsData = await DB.find({ GuildID: guildId });

        if (!guildButtonsData || guildButtonsData.length === 0) {
          return interaction.reply({
            content: "There are no buttons in this guild.",
            ephemeral: true,
          });
        }

        const responseList = guildButtonsData.map((messageData) => {
          const messageLink = `https://discord.com/channels/${guildId}/${messageData.ChannelID}/${messageData.MessageID}`;
          const buttonList = messageData.Buttons.map(
            (button) => `${button.Label} - ${button.CustomID}`
          );
          if (buttonList.length > 0) {
            return `Buttons from ${messageLink}:\n${buttonList.join("\n")}`;
          } else {
            return null;
          }
        });

        const validResponses = responseList.filter(
          (response) => response !== null
        );

        if (validResponses.length > 0) {
          interaction.reply({
            content: `List of buttons in this guild:\n${validResponses.join(
              "\n"
            )}`,
            ephemeral: true,
            flags: "SuppressEmbeds",
          });
        } else {
          interaction.reply({
            content: "There are no buttons in this guild.",
            ephemeral: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
};
