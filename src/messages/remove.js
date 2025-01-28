const { EmbedBuilder } = require('discord.js');
const { convertTime } = require('../helpers/convertTime');

module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue.',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🔇 **I\'m not in the same voice channel as you!**');
        }

        const position = parseInt(args[0]);
        if (isNaN(position) || position > player.queue.length || position < 1) {
            return message.channel.send('⚠️ **Please provide a valid position in the queue.**');
        }

        const song = player.queue[position - 1]; // Convert to 0-based index
        await player.queue.splice(position - 1, 1); // Remove the song

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`🎵 **Removed** • [${song.title}](${song.uri}) \`${convertTime(song.length, true)}\` • Requested by: ${song.requester}`);

        return message.channel.send({ embeds: [embed] });
    }
};
