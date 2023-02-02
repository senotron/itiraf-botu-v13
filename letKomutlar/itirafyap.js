const {Client, CommandInteraction, MessageEmbed, Permissions} = require("discord.js");
const model = require("../models/guild");
module.exports = {
  slash: true,
  enable: true,
  name: "itiraf-yap",
  description: 'İtiraf yaparsın',
  options: [

          { 
          name: "itiraf",
          description: "İtiraf yaz", 
          type: 3, 
          required: true
      }
    
  ],
 run: async (client, interaction) => {  
  const uye = interaction.member
  const itiraf = interaction.options.getString("itiraf");

        const { itirafChannel } = await model.findOne({ GuildID: interaction.guild.id }) || { itirafChannel: null };
        if (!itirafChannel) return;
      
        const channel = interaction.guild.channels.cache.get(itirafChannel);
        try{
          channel.send({
            embeds: [new MessageEmbed()
              .setAuthor({name:interaction.user.tag,iconURL: interaction.user.avatarURL()})
              .setDescription(`Hey millet! Yeni bir itiraf geldi! \r\n ---------- \r\n Ama itirafın sahibinin kim olduğunu size söyleyemem.\r\n ---------- \r\n İşte gizli kişinin yaptığı itiraf; \r\n || ${itiraf} ||`)
              .setColor("#2ACAEA")
              .setFooter({text:`${interaction.guild.name}`})
              .setTimestamp()
            ]
          })
        }
        catch{
      
        }
   //--------------İtiraf kanalına mesaj gönderme
const { itirafadminChannel } = await model.findOne({ GuildID: interaction.guild.id }) || { itirafadminChannel: null };
        if (!itirafadminChannel) return;
      
        const chanmnel = interaction.guild.channels.cache.get(itirafadminChannel);
        try{
          chanmnel.send({
            embeds: [new MessageEmbed()
              .setDescription(`Hey admin! Yeni bir itiraf geldi! \r\n ---------- \r\n İtirafın sahibi: ${uye}\r\n ---------- \r\n İşte  kişinin yaptığı itiraf; \r\n || ${itiraf} ||`)
              .setColor("#2ACAEA")
              .setFooter({text:`${interaction.guild.name}`})
              .setTimestamp()
            ]
          })
        }
        catch{
      
        }
   interaction.reply({content: `İtirafın gönderildi.`, ephemeral: true});
   
   
},
};