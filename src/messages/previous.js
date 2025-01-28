const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'previous',
    description: 'Play the previous song in the queue.',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('🎶 **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🚫 **I\'m not in the same voice channel as you!**');
        }

        // Check if there's a previous song
        if (!player.queue.previous) return message.channel.send('⚠️ **No previous song found.**');

        // Play the previous song
        await player.play(player.queue.previous);

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle('🎵 Previous Song')
            .setDescription(`\`⏮️\` | *Now playing the previous song:*`)
            .addFields(
                { name: 'Title:', value: player.queue.previous.title || 'Unknown Title', inline: true },
                { name: 'Artist:', value: player.queue.previous.author || 'Unknown Artist', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: message.author.displayAvatarURL() });

        return message.channel.send({ embeds: [embed] });
    }
};
