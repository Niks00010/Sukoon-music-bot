const { EmbedBuilder, Permissions } = require('discord.js');
const { convertTime } = require('../helpers/convertTime');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'search',
    description: 'Search for a song!',

    async run(message, args, client) {
        if (!args.length) return message.reply('🚫 **Please provide a song name to search for!**');

        const songName = args.join(' ');
        const { channel } = message.member.voice;

        if (!channel) return message.reply('🚫 **You need to join a voice channel first!**');
        if (!channel.permissionsFor(message.guild.members.me).has(Permissions.FLAGS.CONNECT)) {
            return message.reply('❌ **I don’t have permission to connect to your voice channel!**');
        }
        if (!channel.permissionsFor(message.guild.members.me).has(Permissions.FLAGS.SPEAK)) {
            return message.reply('🔇 **I don’t have permission to speak in your voice channel!**');
        }

        const msg = await message.reply(`🔍 **Searching for:** \`${songName}\`...`);

        const player = await client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('one').setEmoji('1️⃣').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('two').setEmoji('2️⃣').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('three').setEmoji('3️⃣').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('four').setEmoji('4️⃣').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('five').setEmoji('5️⃣').setStyle(ButtonStyle.Secondary)
            );

        let res = await player.search(songName, { requester: message.author });
        if (!res.tracks.length) return message.reply('❌ **No results found!**');

        if (res.type === 'PLAYLIST') {
            for (let track of res.tracks) player.queue.add(track);
            if (!player.playing && !player.paused) player.play();

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`**Queued:** [${res.playlistName}](${songName}) \`${convertTime(player.queue.durationLength, true)}\` (${res.tracks.length} tracks) • **Requested by:** ${res.tracks[0].requester}`);

            return message.reply({ embeds: [embed] });
        } else {
            let index = 1;
            const results = res.tracks.slice(0, 5).map(x => `**(${index++}.)** [${x.title}](${x.uri}) \`${convertTime(x.length, true)}\` - **Author:** ${x.author}`).join('\n');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Song Selection...`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor('Blue')
                .setDescription(results)
                .setFooter({ text: 'Please select a song within 30 seconds.' });

            await msg.edit({ embeds: [embed], components: [row], content: ' ' });

            const filter = (btnInt) => btnInt.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, max: 1, time: 30000 });

            collector.on('collect', async (btnInt) => {
                if (!player || collector.ended) return collector.stop();
                const id = btnInt.customId;

                let trackIndex = parseInt(id.replace('one', '0').replace('two', '1').replace('three', '2').replace('four', '3').replace('five', '4'));
                const track = res.tracks[trackIndex];

                player.queue.add(track);
                if (!player.playing && !player.paused) player.play();

                const trackEmbed = new EmbedBuilder()
                    .setDescription(`**Queued:** [${track.title}](${track.uri}) \`${convertTime(track.length, true)}\` • **Requested by:** ${track.requester}`)
                    .setColor('Blue');

                if (msg) msg.edit({ embeds: [trackEmbed], components: [], content: ' ' });
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await msg.edit({ content: '⏳ No interaction, command timed out.', embeds: [], components: [] });
                    if (!player.playing) player.destroy();
                }
            });
        }
    }
};
