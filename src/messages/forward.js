const { EmbedBuilder } = require('discord.js');
const formatDuration = require('../helpers/formatDuration');

const fastForwardNum = 10;

module.exports = {
    name: "forward",
    description: "Forward the currently playing song.",
    aliases: ["forward"],
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        const value = parseInt(args[0]) || fastForwardNum; // Use provided value or default
        const song = player.queue.current;
        const currentDuration = formatDuration(player.position);

        if (player.position + value * 1000 < song.length) {
            await player.seek(player.position + value * 1000);

            const newDuration = formatDuration(player.position + value * 1000);
            const embed = new EmbedBuilder()
                .setDescription(`⏭️ | *Forwarded to:* \`${newDuration}\``)
                .setColor('Green')
                .setFooter({ text: 'Enjoy your music! 🎶' });

            return message.reply({ embeds: [embed] });
        } else {
            return message.reply('⚠️ **You can\'t forward beyond the duration of the song!**');
        }
    }
};
