const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription("To są informacje o mnie!")
        .setColor("9B59B6")
        .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
        .addField("ID", message.author.id)
        .addField("Create at", message.author.createdAt);


message.channel.sendEmbed(embed);
}

module.exports.help = {
    name: "userinfo"
}