const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const formatduration = require("../helpers/formatDuration");
const MusicCard = require('../Schemas/musicCardSchema');
const { default: axios } = require('axios');
const { Classic } = require('musicard'); 
const fs = require("fs")

module.exports = async (client, player, track) => {
    const source = player.queue.current.sourceName || "unknown";
    const guildId = player.guildId;

    const musicCardData = await MusicCard.findOne({ guildId });
    const isMusicCardEnabled = musicCardData ? musicCardData.musicCardEnabled : false;

    const channelId = player.options.voiceId;
    const status = `<a:music:1333708662417526814> Now Playing: ${track.title}`;

    try {
        await axios.put(`https://discord.com/api/v10/channels/${channelId}/voice-status`,
            { status: status },
            { headers: { Authorization: `Bot ${process.env.token}` }}
        );
    } catch (err) {
        console.log('Error updating voice status:', err);
    }

    if (isMusicCardEnabled) {
        const musicard = await Classic({
        thumbnailImage: `${track.thumbnail}`,
        backgroundColor: "#00008B",
        progress: 10,
        progressColor: "#FFFFFF",
        progressBarColor: "#000000",
        name: `[${track.title || "Unknown"}]`,
        nameColor: "#FFFFFF",
        author: `${track.author || "Unknown"}`,
        authorColor: "#FFFFFF",
        startTime: "0:00",
        endTime: `${formatduration(track.length, true)}`,
        timeColor: "#000000"
    });
        fs.writeFileSync("musicard.png", musicard);
        

        const button1 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder().setCustomId('previous').setEmoji("<:previous:1333750536473935924>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('pause').setEmoji("<:blue_pause:1333750886530289716>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('resume').setEmoji("<:blue_play:1333751228890353686>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('skip').setEmoji("<:skip:1333750394215727114>").setStyle(ButtonStyle.Secondary),

                // new ButtonBuilder().setCustomId('shuffle').setEmoji("<:m_suffle:1333449860912779274>").setLabel('Shuffle').setStyle(ButtonStyle.Primary),

                // new ButtonBuilder().setCustomId('loop').setEmoji("<:m_loop:1333449865971109908>").setLabel('Loop').setStyle(ButtonStyle.Primary),

                new ButtonBuilder().setCustomId('autoplay').setEmoji("<a:BlueLightning:1333752497621434384>").setStyle(ButtonStyle.Secondary),

            

            );

        // const button2 = new ActionRowBuilder()

        //     .addComponents(

               

        

        //         // new ButtonBuilder().setCustomId('queue').setEmoji("<:m_que:1333449836611113040>").setLabel('Queue').setStyle(ButtonStyle.Secondary)

        //     );
        await client.channels.cache.get(player.textId)?.send({
             components: [button1],
            files: [musicard],
            content: status
        });
    } else {
        // const embed = new EmbedBuilder()
        //     .setAuthor({ name: "Now Playing" })
        //     .setDescription(`<a:playing_song:1332981272963973193> **[${track.title || "Unknown"}](${track.uri})\n\n<a:DarkBlueCrown:1333348020716179477> **Artist: ${track.author || "Unknown"}\n<:DarkBlue:1333347984057962591> **Requester: ${track.requester}**\n<a:duration:1333346712366092311> **Duration: ${formatduration(track.length, true)}**`)
        //     .setColor('#F1C40F')
        //     .setFooter({ text: `Source: $(source)` })
        //     .setTimestamp();

        const embed = new EmbedBuilder()
            .setTitle(`${track.author || "Unknown"}`)
            .setDescription(`[${track.title || "Unknown"}](${track.uri})\n00:00 <:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844><:blank_gray:1333744732701982844> ${formatduration(track.length, true)}\n-# Requested by ${track.requester}`)

        if (track.thumbnail) {
            embed.setThumbnail(track.thumbnail);
        } else {
            embed.setThumbnail(client.user.displayAvatarURL());
        }

        const buttonRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('previous').setEmoji("<:previous:1333750536473935924>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('pause').setEmoji("<:blue_pause:1333750886530289716>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('resume').setEmoji("<:blue_play:1333751228890353686>").setStyle(ButtonStyle.Secondary),

                new ButtonBuilder().setCustomId('skip').setEmoji("<:skip:1333750394215727114>").setStyle(ButtonStyle.Secondary),

                // new ButtonBuilder().setCustomId('shuffle').setEmoji("<:m_suffle:1333449860912779274>").setLabel('Shuffle').setStyle(ButtonStyle.Primary),

                // new ButtonBuilder().setCustomId('loop').setEmoji("<:m_loop:1333449865971109908>").setLabel('Loop').setStyle(ButtonStyle.Primary),

                new ButtonBuilder().setCustomId('autoplay').setEmoji("<a:BlueLightning:1333752497621434384>").setStyle(ButtonStyle.Secondary),

            );

        // const buttonRow2 = new ActionRowBuilder()
        //     .addComponents(
              

            

                

        //         // new ButtonBuilder().setCustomId('queue').setEmoji("<:m_que:1333449836611113040>").setLabel('Queue').setStyle(ButtonStyle.Secondary)
        //     );

        const oldMessageId = player.data.get("nowPlayingMessageId");
        if (oldMessageId) {
            try {
                const oldMessage = await client.channels.cache.get(player.textId)?.messages.fetch(oldMessageId);
                if (oldMessage) await oldMessage.delete();
            } catch (err) {
                console.log(' Error deleting old message:', err);
            }
        }

        // Send the new embed message
        const newMessage = await client.channels.cache.get(player.textId)?.send({ embeds: [embed], components: [buttonRow1] });
        player.data.set("nowPlayingMessageId", newMessage.id); // Store the new message ID
    }
};