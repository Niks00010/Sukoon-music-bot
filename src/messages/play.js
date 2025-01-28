const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { convertTime } = require("../helpers/convertTime");

module.exports = {
    name: "play",
    description: "🎶 Play a song from any supported source.",
    aliases: ["p"],
    run: async (client, messages, args) => {
        try {
            const search = args.join(" ");
            const { channel } = messages.member.voice;

            if (!channel) {
                return messages.reply({
                    content: "🚫 **You need to be in a voice channel to play music!**",
                    ephemeral: true
                });
            }

            if (!channel.permissionsFor(messages.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
                return messages.reply({
                    content: "🔒 **I don't have permission to join your voice channel!**",
                    ephemeral: true
                });
            }

            if (!channel.permissionsFor(messages.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
                return messages.reply({
                    content: "🔇 **I don't have permission to play music in your voice channel!**",
                    ephemeral: true
                });
            }

            const searchmessage = await messages.reply({ content:`<a:searching:1333749024498389052> Searching... \`${search}\`` });

            const player = await client.manager.createPlayer({
                guildId: messages.guild.id,
                textId: messages.channel.id,
                voiceId: channel.id,
                volume: 100,
                deaf: true
            });

            const res = await player.search(search, { requester: messages.author });

            if (!res.tracks.length) {
                return messages.reply("❌ **No results found!**");
            }

            await searchmessage.edit({ content: `<a:playing_song:1332981272963973193> Now Playing \`${search}\`` });

            if (res.type === "PLAYLIST") {
                for (let track of res.tracks) {
                    player.queue.add(track);
                }
                if (!player.playing && !player.paused) {
                    player.play();
                }

                const embed = new EmbedBuilder()
                    .setColor("#1DB954") 
                    .setTitle("🎶 Playlist Added")
                    .setDescription(`**<a:playing_song:1332981272963973193>[${res.playlistName}](${search})** \n\n**Tracks Queued:** \`${res.tracks.length}\`\n<a:duration:1333346712366092311>**Total Duration:** \`${convertTime(res.tracks[0].length + player.queue.durationLength, true)}\``)
                .setImage("https://media.discordapp.net/attachments/1332293757256601640/1333390754437005344/Second_Size.gif?ex=6798b869&is=679766e9&hm=5fbb6fcbc527ef59fccc9bed745107922bdc44563cfbc207c1b48d2323b68e3c&")
                    .setFooter({ text: "Enjoy your music! 🎧" })

                return messages.reply({ content: '', embeds: [embed] });
            } else {
                player.queue.add(res.tracks[0]);

                if (!player.playing && !player.paused) {
                    player.play();
                } else {
                    const embed = new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle("<a:012Blue_MusicMote:1333711727174484001> Track Queued")
                        .setDescription(`**<a:playing_song:1332981272963973193>[${res.tracks[0].title}](${res.tracks[0].uri})** \n\n<a:duration:1333346712366092311>**Duration:** \`${convertTime(res.tracks[0].length, true)}\``)
                        .setImage("https://media.discordapp.net/attachments/1332293757256601640/1333390754437005344/Second_Size.gif?ex=6798b869&is=679766e9&hm=5fbb6fcbc527ef59fccc9bed745107922bdc44563cfbc207c1b48d2323b68e3c&")
                        .setFooter({ text: "Playing now! 🎶" })
                        .setThumbnail(res.tracks[0].thumbnail);

                    await searchmessage.delete();
                    return messages.reply({ content: '', embeds: [embed] });
                }

                // const embed = new EmbedBuilder()
                //     .setColor("#5865F2")
                //     .setTitle("<a:012Blue_MusicMote:1333711727174484001> Track Queued")
                //     .setDescription(`**<a:playing_song:1332981272963973193>[${res.tracks[0].title}](${res.tracks[0].uri})** \n\n<a:duration:1333346712366092311>**Duration:** \`${convertTime(res.tracks[0].length, true)}\``)
                // .setImage("https://media.discordapp.net/attachments/1332293757256601640/1333390754437005344/Second_Size.gif?ex=6798b869&is=679766e9&hm=5fbb6fcbc527ef59fccc9bed745107922bdc44563cfbc207c1b48d2323b68e3c&")
                //     .setFooter({ text: "Playing now! 🎶" })
                //     .setThumbnail(res.tracks[0].thumbnail); 

                // return messages.reply({ content: '', embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            return messages.reply("❗ **An error occurred while trying to play the song.**");
        }
    }
};
