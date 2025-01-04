module.exports = (client, interaction) => {
    console.log(`${client.user.tag} online!`);
    client.user.setPresence({activities: [{name:"senotron",status:"dnd"}], });   
};
