const { EmbedBuilder, Permissions } = require('discord.js');
const formatDuration = require('../helpers/formatDuration');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific timestamp in the currently playing song.',
    
    run: async(client, messages, args) => {
        if (!args.length) return message.reply('🚫 **Please provide the number of seconds to seek by.**');
        
        const value = parseInt(args[0]);
        if (isNaN(value) || value < 1) {
            return message.reply('⚠️ **Please provide a valid number of seconds greater than 0.**');
        }
        
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');
        
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        if (value * 1000 >= player.queue.current.length || value < 0) {
            return message.reply('⚠️ **You can\'t seek more than the duration of the song!**');
        }

        await player.seek(value * 1000);
        
        const duration = formatDuration(player.position);
        const embed = new EmbedBuilder()
            .setDescription(`⏮️ | *Seeked to:* \`${duration}\``)
            .setColor('Blue');

        return message.reply({ embeds: [embed] });
    }
};
