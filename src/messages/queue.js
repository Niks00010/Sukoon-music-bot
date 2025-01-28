const { EmbedBuilder } = require('discord.js');
const { NormalPage } = require('../helpers/pageQueue.js');
const formatDuration = require('../helpers/formatDuration.js');

module.exports = {
    name: 'queue',
    description: 'Show the queue of songs.',
    
    run: async (client, message, args) => {
        await message.deferReply({ ephemeral: false });

        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.channel.send('❌ **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.channel.send('🚫 **You need to be in the same voice channel as the bot!**');
        }

        const pageRequested = args[0] ? parseInt(args[0]) : undefined;
        const song = player.queue.current;
        const queueDuration = formatDuration(player.queue.durationLength + song.length);

        let totalPages = Math.ceil(player.queue.length / 10);
        if (totalPages === 0) totalPages = 1;

        const songList = [];
        for (let i = 0; i < player.queue.length; i++) {
            const queueSong = player.queue[i];
            songList.push(
                `**${i + 1}.** [${queueSong.title}](${queueSong.uri}) \`[${formatDuration(queueSong.length)}]\` • Requested by: ${queueSong.requester}`
            );
        }

        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            const songsOnPage = songList.slice(i * 10, i * 10 + 10).join('\n');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `🎶 Queue - ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setColor('#3498DB')
                .setDescription(
                    `**Currently Playing:**\n[${song.title}](${song.uri}) \`[${formatDuration(song.length)}]\` • Requested by: ${song.requester}\n\n**Rest of Queue:**\n${songsOnPage === '' ? 'Nothing in the queue.' : songsOnPage}`
                )
                .setFooter({ text: `Page ${i + 1}/${totalPages} | Total Songs: ${player.queue.length} | Total Duration: ${queueDuration}` })
                .setTimestamp();

            if (song.thumbnail) {
                embed.setThumbnail(song.thumbnail);
            } else {
                embed.setThumbnail(message.author.displayAvatarURL());
            }

            pages.push(embed);
        }

        if (!pageRequested) {
            if (pages.length === totalPages && player.queue.length > 10) {
                NormalPage(client, message, pages, 60000, player.queue.length, queueDuration);
            } else {
                return message.channel.send({ embeds: [pages[0]] });
            }
        } else {
            if (isNaN(pageRequested)) return message.channel.send('⚠️ **Please enter a valid number!**');
            if (pageRequested > totalPages) return message.channel.send(`⚠️ **There are only ${totalPages} pages available!**`);
            const pageIndex = pageRequested === 0 ? 0 : pageRequested - 1;
            return message.channel.send({ embeds: [pages[pageIndex]] });
        }
    }
};
