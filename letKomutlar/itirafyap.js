const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const model = require("../models/guild");

module.exports = {
  slash: true,
  enable: true,
  name: "itiraf-yap",
  description: "İtiraf yaparsın",
  options: [
    {
      name: "itiraf",
      description: "İtiraf yaz",
      type: 3,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const uye = interaction.member;
    const itiraf = interaction.options.getString("itiraf");

    const { itirafChannel, itirafadminChannel } = await model.findOne({ GuildID: interaction.guild.id }) || {};

    if (!itirafChannel && !itirafadminChannel) {
      return interaction.reply({ content: "İtiraf sistemi aktif değil veya kanallar ayarlanmamış.", ephemeral: true });
    }

    if (itirafChannel) {
      const channel = interaction.guild.channels.cache.get(itirafChannel);

      if (channel) {
        try {
          channel.send({
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `Hey millet! Yeni bir itiraf geldi! \n----------\nAma itirafın sahibinin kim olduğunu size söyleyemem.\n----------\nİşte gizli kişinin yaptığı itiraf;\n|| ${itiraf} ||`
                )
                .setColor("#2ACAEA")
                .setFooter({ text: `${interaction.guild.name}` })
                .setTimestamp(),
            ],
          });
        } catch (err) {
          console.error("İtiraf kanalına mesaj gönderilirken bir hata oluştu:", err);
        }
      }
    }

    if (itirafadminChannel) {
      const adminChannel = interaction.guild.channels.cache.get(itirafadminChannel);

      if (adminChannel) {
        try {
          adminChannel.send({
            embeds: [
              new MessageEmbed()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setDescription(
                  `Hey admin! Yeni bir itiraf geldi!\n----------\nİtirafın sahibi: ${uye}\n----------\nİşte kişinin yaptığı itiraf;\n|| ${itiraf} ||`
                )
                .setColor("#2ACAEA")
                .setFooter({ text: `${interaction.guild.name}` })
                .setTimestamp(),
            ],
          });
        } catch (err) {
          console.error("Admin kanalına mesaj gönderilirken bir hata oluştu:", err);
        }
      }
    }

    interaction.reply({ content: "İtirafın gönderildi.", ephemeral: true });
  },
};
