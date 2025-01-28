const { EmbedBuilder } = require('discord.js');
const { find } = require('llyrics');

module.exports = {
    name: 'lyric',
    description: 'Display lyrics of a song.',
    aliases: ['lyrics', 'songlyrics'],
    run: async(client, messages, args) => {
        await messages.deferReply({ ephemeral: false });
        const player = client.manager.players.get(messages.guild.id);
        if (!player) return messages.editReply('No song is currently playing in this guild!');

        const { channel } = messages.member.voice;
        if (!channel || messages.member.voice.channel !== messages.guild.members.me.voice.channel) {
            return messages.editReply("I'm not in the same voice channel as you!");
        }

        let song = args.join(' ');
        const CurrentSong = player.queue.current;
        if (!song && CurrentSong) song = CurrentSong.title;

        try {
            const lyrics = await find({
                song: song,
                engine: 'youtube',
                forceSearch: true,
            });
            if (!lyrics) return messages.editReply(`No lyrics found for ${song}`);

            const lyricsEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`🎶 Lyrics for: ${song}`)
                .setDescription(lyrics.lyrics.length > 2048 ? 'Lyrics are too long to display!' : lyrics.lyrics)
                .setThumbnail(lyrics.artworkURL)
                .setTimestamp();

            return messages.editReply({ content: ' ', embeds: [lyricsEmbed] });
        } catch (err) {
            console.error(err);
            return messages.editReply(`An error occurred while fetching lyrics for ${song}`);
        }
    }
};
