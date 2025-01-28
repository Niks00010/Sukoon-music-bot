const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip the currently playing song!',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **You need to be in the same voice channel as the bot to skip the song!**');
        }

        await player.skip();

        const embed = new EmbedBuilder()
            .setDescription('⏭️ **Song has been skipped!** Enjoy the next track! 🎶')
            .setColor('Blue')
            .setFooter({ text: 'Use `!queue` to see what\'s next!' });

        return message.reply({ embeds: [embed] });
    }
};
