const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'skipto',
    description: 'Skips to a certain song in the queue.',
    
    run: async (client, message, args) => {
        const value = parseInt(args[0]);

        if (isNaN(value)) return message.reply('⚠️ **Please provide a valid position!**');
        
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **You need to be in the same voice channel as the bot to skip!**');
        }

        if (value > player.queue.length || (value && !player.queue[value - 1])) {
            return message.reply('⚠️ **You can\'t skip to a song that doesn\'t exist!**');
        }

        await player.queue.splice(0, value - 1);
        await player.skip();

        const embed = new EmbedBuilder()
            .setDescription(`⏭️ | *Skipped to song in position:* \`${value}\``)
            .setColor('Blue');

        return message.reply({ embeds: [embed] });
    }
};
