const {Client, CommandInteraction, MessageEmbed, Permissions} = require("discord.js");
const model = require("../models/guild");
module.exports = {
    name:"itiraf-admin-kanal",
    description:"İtiraf Ayarları",
    type:1,
    options:[
     
        {
            name:"ayarla",
            description:"Ayarlama İşlemleri",
            type:1,
            options:[{name:"itiraf_kanalı",description:"İtiraf kanalını ayarlar",type:7,required:true,channel_types:[0]}]            
        },
        {
            name:"sıfırla",
            description:"İtirafadmin kanalını sıfırlar",
            type:1            
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
         const guild = interaction.guild;

        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        {
         // interaction.deferReply();
          interaction.reply({content:"Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!",ephemeral:true});
          return;
        }
        let SubCmd = interaction.options.getSubcommand();
       // interaction.deferReply();
        switch(SubCmd){
        
            case "ayarla":{
          let {itiraf} = await model.findOne({GuildID:guild.id});
        if(!itiraf) return interaction.reply({content: `İtiraf Sistemi Aktif Değil.`, ephemeral: true});
                let itiraf_kanalı = interaction.options.getChannel("itiraf_kanalı");
                await model.updateOne({GuildID: interaction.guild.id},{itirafadminChannel: itiraf_kanalı.id},{upsert:true});
                interaction.reply({embeds:[new MessageEmbed().setTitle("İtiraf Kanalı Ayarlandı!").setColor("GREEN").setDescription(`İtiraf kanalı ayarlandı! İtiraf kanalınız: <#${itiraf_kanalı.id}>`)]});
                break;
            }
            case "sıfırla":{
                        let {itiraf} = await model.findOne({GuildID:guild.id});
        if(!itiraf) return interaction.reply({content: `İtiraf Sistemi Aktif Değil.`, ephemeral: true});
                await model.updateOne({GuildID: interaction.guild.id},{itirafadminChannel: null},{upsert:true});
                interaction.reply({embeds:[new MessageEmbed().setTitle("İtiraf Kanalı Sıfırlandı!").setColor("RED").setDescription(`İtiraf kanalı kapatıldı! Artık sunucunuzda itirafların gideceği kanalı yok!`)]});
                break;
            }
        }


    }
}