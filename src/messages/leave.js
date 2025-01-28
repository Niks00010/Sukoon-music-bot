const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "leave",
    description: "Disconnect the bot from your voice channel.",
    aliases: ["disconnect", "exit"],
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);

        if (!player) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **There is no music playing in this guild!**")
                ]
            });
        }

        const { channel } = message.member.voice;

        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("🔒 **You need to be in the same voice channel as me to disconnect!**")
                ]
            });
        }

        await player.destroy();

        const embed = new EmbedBuilder()
           
            .setDescription(`<a:emoji:1333400069986320404>**Left the channel:** \`${channel.name}\``)
            .setColor('#E74C3C')
            .setFooter({ text: `Goodbye!`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
