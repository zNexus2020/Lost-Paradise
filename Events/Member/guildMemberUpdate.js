const { Client, GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  /**
   * @param {Client} client
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  async execute(client, oldMember, newMember) {
    if (!oldMember.premiumSince && newMember.premiumSince) {
      newMember.guild.channels.get("882330509345194004").send("hello");
    }
  },
};
