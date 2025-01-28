const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume the music!'),

    run: async(client, messages, args) => {
        const player = client.manager.players.get(messages.guild.id);
        if (!player) return messages.reply('🎶 **No song is currently playing in this guild!**');

        const { channel } = messages.member.voice;
        if (!channel || messages.member.voice.channel !== messages.guild.members.me.voice.channel) {
            return messages.reply('🚫 **I\'m not in the same voice channel as you!**');
        }

        // Toggle pause state
        const paused = !player.paused; // If currently paused, unpause, and vice versa
        await player.pause(paused);

        const status = paused ? '⏸️ **Paused**' : '▶️ **Resumed**';
        const song = player.queue.current;

        const embed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Music Playback Status')
            .setDescription(`\`⏯\` | The song **[${song.title}](${song.uri})** has been: ${status}`)
            .setTimestamp()
            .setFooter({ text: 'Enjoy your music!', iconURL: messages.user.displayAvatarURL() });

        return messages.reply({ embeds: [embed] });
    }
};
