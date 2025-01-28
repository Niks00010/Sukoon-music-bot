const { EmbedBuilder } = require('discord.js');
const formatDuration = require('../helpers/formatDuration');

const rewindNum = 10;

module.exports = {
    name: 'rewind',
    description: 'Rewind the currently playing song.',
    
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🔇 **I\'m not in the same voice channel as you!**');
        }

        const value = args[0]; // Number of seconds to rewind
        const currentDuration = formatDuration(player.position);

        // Rewind with specified seconds
        if (value) {
            if ((player.position - value * 1000) > 0) {
                await player.seek(player.position - value * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`⏮️ | *Rewinded to:* \`${formatDuration(player.position)}\``)
                    .setColor('Blue');

                return message.channel.send({ embeds: [embed] });
            } else {
                return message.channel.send('⚠️ **You can\'t rewind more than the current timestamp of the song!**');
            }
        } else {
            // Default rewind amount
            if ((player.position - rewindNum * 1000) > 0) {
                await player.seek(player.position - rewindNum * 1000);
                
                const embed = new EmbedBuilder()
                    .setDescription(`⏮️ | *Rewinded to:* \`${formatDuration(player.position)}\``)
                    .setColor('Blue');

                return message.channel.send({ embeds: [embed] });
            } else {
                return message.channel.send('⚠️ **You can\'t rewind more than the current timestamp of the song!**');
            }
        }
    }
};
