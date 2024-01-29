require("dotenv").config();
const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 131071 });

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.commands = new Collection();

client.login(process.env.TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
