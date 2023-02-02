const mongoose = require("mongoose");

const guildSh = new mongoose.Schema({
    GuildID: String,
    itiraf: Boolean,
    itirafChannel: String,
    itirafadminChannel: String,


   });
   
   module.exports = mongoose.model("guild", guildSh);