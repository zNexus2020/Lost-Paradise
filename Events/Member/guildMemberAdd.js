const { Client, EmbedBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    if (!member.user.bot)
      member.guild.channels.cache.get("930786450629333023").send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Welcome to ${member.guild.name}`)
            .setDescription(
              `**✧⎯『 WELCOME ${member} 』⎯✧** \nThankyou for joining!! You're the **${
                member.guild.members.cache.filter((member) => !member.user.bot)
                  .size
              }th** member, we hope you will get a nice expirience here`
            )
            .addFields(
              {
                name: "Here the rules: ",
                value: "<#1192898748922216548>",
                inline: true,
              },
              {
                name: "Here the news:",
                value: "<#1192902371156697260>",
                inline: true,
              },
              {
                name: "Chat here:",
                value: "<#1190609162011422824>",
                inline: true,
              }
            )
            .setImage("attachment://welcomebanner.gif")
            .setFooter({ text: "®𝙇𝙤𝙨𝙩 𝙋𝙖𝙧𝙖𝙙𝙞𝙨𝙚™" })
            .setColor("325bff"),
        ],
        files: [new AttachmentBuilder("Images/welcomebanner.gif")],
      });
  },
};
