const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "clear",
    description: "Clear the current music queue!",
    aliases: ["clear"],
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **No music is currently playing in this server!**")
                ]
            });
        }

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **You must be in the same voice channel as me to clear the queue!**")
                ]
            });
        }

        await player.queue.clear();

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Queue Cleared')
            .setDescription("`📛` | The music queue has been successfully **cleared**. No more songs are left in the queue.")
            .setColor('#3498DB') // A bright Blue for a professional look
            .setThumbnail(client.user.displayAvatarURL()) // Bot's avatar as the thumbnail
            .setFooter({ text: `Action performed by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
