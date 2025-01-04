const { Client, CommandInteraction, MessageEmbed, Permissions } = require("discord.js");
const model = require("../models/guild");

module.exports = {
  name: "itiraf",
  description: "İtiraf Ayarları",
  type: 1,
  options: [
    {
      type: 1,
      name: "durum",
      description: "Sistemin Aktif/Pasif Durumunu Ayarlar",
      options: [
        {
          name: "sistem-durumu",
          required: true,
          description: "Sistem Durumunu ayarlarsınız",
          type: 3,
          choices: [
            { name: "Aktif", value: "aktif" },
            { name: "Pasif", value: "pasif" },
          ],
        },
      ],
    },
    {
      name: "kanal-ayarla",
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
      name: "kanal-sıfırla",
      description: "İtiraf kanalını sıfırlar",
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
      case "durum": {
        const durum = interaction.options.get("sistem-durumu").value;

        if (durum === "aktif") {
          await model.updateOne({ GuildID: guild.id }, { itiraf: true }, { upsert: true });
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("İtiraf Sistemi Aktif")
                .setColor("GREEN")
                .setDescription(
                  `İtiraf Sistemi Yönetici Tarafından aktif edildi. Artık üyeler kimlikleri açığa çıkmadan itiraf yapabilir.\n*İtiraflar yalnızca sunucu adminlerine gözükür.*`
                ),
            ],
          });
        } else if (durum === "pasif") {
          await model.updateOne({ GuildID: guild.id }, { itiraf: false }, { upsert: true });
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("İtiraf Sistemi Pasif")
                .setColor("RED")
                .setDescription(`İtiraf Sistemi Yönetici Tarafından devre dışı bırakıldı.`),
            ],
          });
        }
        break;
      }

      case "kanal-ayarla": {
        const { itiraf } = await model.findOne({ GuildID: guild.id });
        if (!itiraf) {
          return interaction.reply({ content: `İtiraf Sistemi Aktif Değil.`, ephemeral: true });
        }

        const itiraf_kanalı = interaction.options.getChannel("itiraf_kanalı");
        await model.updateOne(
          { GuildID: interaction.guild.id },
          { itirafChannel: itiraf_kanalı.id },
          { upsert: true }
        );
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("İtiraf Kanalı Ayarlandı!")
              .setColor("GREEN")
              .setDescription(`İtiraf kanalı ayarlandı! İtiraf kanalınız: <#${itiraf_kanalı.id}>`),
          ],
        });
        break;
      }

      case "kanal-sıfırla": {
        const { itiraf } = await model.findOne({ GuildID: guild.id });
        if (!itiraf) {
          return interaction.reply({ content: `İtiraf Sistemi Aktif Değil.`, ephemeral: true });
        }

        await model.updateOne(
          { GuildID: interaction.guild.id },
          { itirafChannel: null },
          { upsert: true }
        );
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("İtiraf Kanalı Sıfırlandı!")
              .setColor("RED")
              .setDescription(
                `İtiraf kanalı kapatıldı! Artık sunucunuzda itirafların gideceği bir kanal yok!`
              ),
          ],
        });
        break;
      }
    }
  },
};
