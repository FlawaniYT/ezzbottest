const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MENAGE_MESSAGES")) return message.channel.sendMessage("Niemasz uprawnień do tej komendy!");
    
     let toMute = message.guild.member (message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.sendMessage("Nie podałeś wzmianki ani identyfikatora użytkownika");
    
     let role = message.guild.roles.find(r => r.name === "SADB Muted");
        
     if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("ten użytkownik nie jest już wyciszony!");
    

    
     await toMute.removeRole(role);

     
    delete bot.mutes[toMute.id];

    fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
        if(err) throw err;
        console.log(`odciszyłem ${toMute.user.tag}.`);
    });
}

module.exports.help = {
    name: "unmute"
}