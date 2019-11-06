const botSettings = require("./botsettings.json");
const Discord = require("discord.js")
const fs = require("fs");

const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

fs.readdir("./cmds/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("Brak poleceń do załadowania!");
        return;
    }

    console.log(`Loading ${jsfiles.length} commands!`);

    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} wczytano!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on("ready", async () => {
    console.log(`Bot jest gotowy! ${bot.user.username}`);

    bot.setInterval(() => {
        for(let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);
            let mutedRole = guild.roles.find(r => r.name === "SADB Muted");
            if(!mutedRole) continue;

            if(Date.now() > time) {
                console.log(`${i} jest teraz w stanie zostać wyciszony!`);

                member.removeRole(mutedRole);
                delete bot.mutes[i];

                fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
                    if(err) throw err;
                    console.log(`wyciszyłem ${member.user.tag}.`);
                });
            }
        }
    }, 5000)
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot, message, args);

    // if(command === `${prefix}info`) {
    //     let embed = new Discord.RichEmbed()
    //         .setAuthor(message.author.username)
    //         .setDescription("To są informacje o mnie!")
    //         .setColor("9B59B6")
    //         .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
    //         .addField("ID", message.author.id)
    //         .addField("Create At", message.author.createdAt);


    //     message.channel.sendEmbed(embed);

    //     return;

    // }

    // if(command === `${prefix}mute`) {
    //     if(!message.member.hasPermission("MENAGE_MESSAGES")) return message.channel.sendMessage("Niemasz uprawnień do tej komendy!");

    //     let toMute = message.guild.member (message.mentions.users.first()) || message.guild.members.get(args[0]);
    //     if(!toMute) return message.channel.sendMessage("Nie podałeś wzmianki ani identyfikatora użytkownika");

    //     if(toMute.id === message.author.id) return message.channel.sendMessage("Nie możesz sam się zmutować.");
    //     if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("nie możesz wyciszyć członka, który jest wyższy lub ma taką samą rolę jak ty.");

    //     let role = message.guild.roles.find(r => r.name === "SADB Muted");
    //     if(!role) {
    //         try{
    //             role = await message.guild.createRole( {
    //                 name: "SADB Muted",
    //                 color: "#000000",
    //                 permissions: []
    //             });
    
    //             message.guild.channels.forEach(async (channel, id) => {
    //                 await channel.overwritePermissions(role, {
    //                     SEND_MESSAGES: false,
    //                     ADD_REACTIONS: false,
    //                 });
    //             });
            
            
    //         } catch(e) {
    //             console.log(e.stack);
    //         }
    //     }

    //     if(toMute.roles.has(role.id)) return message.channel.sendMessage("Ten użytkownik został wyciszony!");

    //     await toMute.addRole(role);
    //     message.channel.sendMessage("Wyciszyłem go");

    //     return;
    // }

    // if(command === `${prefix}unmute`) {
    //     if(!message.member.hasPermission("MENAGE_MESSAGES")) return message.channel.sendMessage("Niemasz uprawnień do tej komendy!");
    
    //     let toMute = message.guild.member (message.mentions.users.first()) || message.guild.members.get(args[0]);
    //     if(!toMute) return message.channel.sendMessage("Nie podałeś wzmianki ani identyfikatora użytkownika");
    
    //     let role = message.guild.roles.find(r => r.name === "SADB Muted");
        
    //     if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("ten użytkownik nie jest już wyciszony!");
    

    
    //     await toMute.removeRole(role);
    //     message.channel.sendMessage("odmutowałem go.");
    
    //     return;
    // }

});


bot.login(botSettings.token);