const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the songs in the queue!',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        await player.queue.shuffle(); 

        const embed = new EmbedBuilder()
            .setDescription('🔀 **Songs have been shuffled!** Enjoy the mix! 🎶')
            .setColor('Blue')
            .setFooter({ text: 'Use `!queue` to check the current song order.' });

        return message.reply({ embeds: [embed] });
    }
};
