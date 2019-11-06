const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
    let msg = await message.channel.send("Generuje icone...");

    if(!message.guild.iconURL) return msg.edit("Niema icon.");

    await message.channel.send({files: [ 
        {
            attachment: message.guild.iconURL,
            name: "icon.png"
        }
    ]});

    msg.delete();
}

module.exports.help = {
    name: "icon"
}