const { Client, CommandInteraction, ButtonInteraction } = require("discord.js");
const fs = require("fs");

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    try {
      const files = fs.readdirSync("./letKomutlar/");

      for (const file of files) {
        const command = require(`../letKomutlar/${file}`);

        if (interaction.commandName.toLowerCase() === command.name.toLowerCase()) {
          return command.run(client, interaction);
        }
      }
    } catch (err) {
      console.error("Komut çalıştırılırken bir hata oluştu:", err);
    }
  }
};
