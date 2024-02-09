const { model, Schema } = require("mongoose");

module.exports = model(
  "buttonDB",
  new Schema({
    GuildID: String,
    ChannelID: String,
    MessageID: String,
    Buttons: [
      {
        CustomID: String,
        Label: String,
        Style: String,
        RoleID: String,
        Type: String,
      },
    ],
  })
);
