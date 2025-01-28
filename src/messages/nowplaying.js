const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const formatDuration = require("../helpers/formatDuration");
const { convertTime } = require("../helpers/convertTime");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Display the song currently playing'),

    run: async(client, messages, args) => {
        const player = client.manager.players.get(messages.guild.id);
        if (!player || !player.queue.current) {
            return messages.reply('🎶 **No song is currently playing in this guild!**');
        }

        const song = player.queue.current;
        const totalDuration = formatDuration(song.length);
        const currentTime = formatDuration(player.position);
        const songStatus = player.playing ? 'Now Playing 🎵' : 'Song Paused ⏸️';
        const songPosition = player.queue.findIndex((s) => s === song) + 1; // Queue position (1-based index)

        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setAuthor({
                name: songStatus,
            })
            .setDescription(`**[${song.title}](${song.uri})**`)
            .addFields(
                { name: '🎤 **Artist:**', value: `${song.author || 'Unknown'}`, inline: true },
                { name: '👤 **Requested by:**', value: `${song.requester}`, inline: true },
                { name: '🔊 **Volume:**', value: `${player.options.volume}%`, inline: true },
                { name: '📜 **Queue Length:**', value: `${player.queue.length}`, inline: true },
                { name: '⏳ **Total Duration:**', value: `${totalDuration}`, inline: true },
                { name: '⏱ **Current Position:**', value: `${currentTime}`, inline: true },
                { name: '🔢 **Queue Position:**', value: `#${songPosition}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: messages.user.displayAvatarURL() });

        // Set thumbnail
        embed.setThumbnail(song.thumbnail || messages.user.displayAvatarURL());

        return messages.reply({ content: " ", embeds: [embed] });
    }
};
