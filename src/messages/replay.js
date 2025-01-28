const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'replay',
    description: 'Replay the current song!',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('❌ **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🚫 **I\'m not in the same voice channel as you!**');
        }

        await player.seek(0); // Replay the song

        const embed = new EmbedBuilder()
            .setDescription("⏮️ **Song has been replayed!**")
            .setColor('#3498DB') // A calming Blue color
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        return message.channel.send({ embeds: [embed] });
    }
};
