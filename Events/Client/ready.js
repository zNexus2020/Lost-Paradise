const { Client } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Logged as ${client.user.tag}`);
    const updateActivity = () => {
      console.log(`Updating activity with ${client.guilds.cache.size} servers`);
      client.user.setActivity(`with ${client.guilds.cache.size} servers`);
    };
    try {
      setInterval(updateActivity, 900000);
      updateActivity(client);
    } catch (err) {
      console.log(err);
    }
  },
};
