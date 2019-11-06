const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MENAGE_MESSAGES")) return message.channel.sendMessage("Niemasz uprawnień do tej komendy!");

    let toMute = message.guild.member (message.mentions.users.first()) || message.guild.members.get(args[0]);
     if(!toMute) return message.channel.sendMessage("Nie podałeś wzmianki ani identyfikatora użytkownika");

     if(toMute.id === message.author.id) return message.channel.sendMessage("Nie możesz sam się zmutować.");
     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("nie możesz wyciszyć członka, który jest wyższy lub ma taką samą rolę jak ty.");

     let role = message.guild.roles.find(r => r.name === "SADB Muted");
     if(!role) {
         try{
             role = await message.guild.createRole( {
                 name: "SADB Muted",
                 color: "#000000",
                 permissions: []
             });

             message.guild.channels.forEach(async (channel, id) => {
                 await channel.overwritePermissions(role, {
                     SEND_MESSAGES: false,
                     ADD_REACTIONS: false,
                 });
             });


         } catch(e) {
             console.log(e.stack);
         }
     }

     if(toMute.roles.has(role.id)) return message.channel.sendMessage("Ten użytkownik został wyciszony!");

     bot.mutes[toMute.id] = {
         guild: message.guild.id,
         time: Date.now() + parseInt(args[1]) * 1000
     }
     await toMute.addRole(role);

     fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
         if(err) throw err;
         message.channel.send("Wyciszyłem użytkownika.");
         
     });

     
}

module.exports.help = {
    name: "mute"
}