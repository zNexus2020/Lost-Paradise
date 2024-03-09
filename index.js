require("dotenv").config();
const keepAlive = require("./site");

const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 131071 });

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.commands = new Collection();

module.exports = client;

const { connect } = require("mongoose");
connect(process.env.MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
client.login(process.env.TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});

keepAlive()
