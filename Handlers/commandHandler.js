function loadCommands(client) {
  const fs = require("fs");
  let commandsArray = [];

  const commandsFolder = fs.readdirSync("./Commands");
  for (const folder of commandsFolder) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);
      commandsArray.push(commandFile.data.toJSON());

      continue;
    }
  }

  client.application.commands.set(commandsArray);
  return console.log("Commands Loaded");
}
module.exports = { loadCommands };
