const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const model = require("../models/guild");

module.exports = {
  name: "itiraf-admin-kanal",
  description: "İtiraf Ayarları",
  type: 1,
  options: [
    {
      name: "ayarla",
      description: "Ayarlama İşlemleri",
      type: 1,
      options: [
        {
          name: "itiraf_kanalı",
          description: "İtiraf kanalını ayarlar",
          type: 7,
          required: true,
          channel_types: [0],
        },
      ],
    },
    {
      name: "sıfırla",
      description: "İtiraf admin kanalını sıfırlar",
      type: 1,
    },
  ],

  run: async (client, interaction) => {
    const guild = interaction.guild;

    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply({
        content: "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!",
        ephemeral: true,
      });
    }

    const subCommand = interaction.options.getSubcommand();

    switch (subCommand) {
      case "ayarla": {
        const { itiraf } = await model.findOne({ GuildID: guild.id });
        if (!itiraf) {
          return interaction.reply({
            content: "İtiraf Sistemi Aktif Değil.",
            ephemeral: true,
          });
        }

        const itirafChannel = interaction.options.getChannel("itiraf_kanalı");

        await model.updateOne(
          { GuildID: guild.id },
          { itirafadminChannel: itirafChannel.id },
          { upsert: true }
        );

        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("İtiraf Kanalı Ayarlandı!")
              .setColor("GREEN")
              .setDescription(`İtiraf kanalı ayarlandı! İtiraf kanalınız: <#${itirafChannel.id}>`),
          ],
        });
      }

      case "sıfırla": {
        const { itiraf } = await model.findOne({ GuildID: guild.id });
        if (!itiraf) {
          return interaction.reply({
            content: "İtiraf Sistemi Aktif Değil.",
            ephemeral: true,
          });
        }

        await model.updateOne(
          { GuildID: guild.id },
          { itirafadminChannel: null },
          { upsert: true }
        );

        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("İtiraf Kanalı Sıfırlandı!")
              .setColor("RED")
              .setDescription(
                "İtiraf kanalı kapatıldı! Artık sunucunuzda itirafların gideceği bir kanal yok!"
              ),
          ],
        });
      }
    }
  },
};
