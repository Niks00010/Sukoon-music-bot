const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'Resume the music!',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('❌ **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🚫 **I\'m not in the same voice channel as you!**');
        }
        
        if (!player.paused) {
            return message.channel.send('🎶 **The music is already playing!**');
        }

        await player.pause(false); // Resume the music

        const embed = new EmbedBuilder()
            .setDescription("⏯️ **The song has been resumed!**")
            .setColor('#2ECC71') // A fresh green color
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        return message.channel.send({ embeds: [embed] });
    }
};
