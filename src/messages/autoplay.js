const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "autoplay",
    description: "Autoplay music (Randomly play songs)",
    aliases: ["autoplay"],
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("❌ **No music is currently playing in this server!**")
            ]
        });

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **You need to be in the same voice channel as me to use this command!**")
                ]
            });
        }

        if (player.data.get("autoplay")) {
            await player.data.set("autoplay", false);
            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setTitle("🎶 Autoplay Deactivated")
                .setDescription("`📻` | Autoplay has been **disabled**. The queue has been cleared, and no more random songs will be played.")
                .setColor('#E74C3C')
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter({ text: 'Autoplay Off', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, { requester: message.author });
            if (!res.tracks.length) return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **Autoplay is not supported for this track source!**")
                ]
            });

            await player.data.set("autoplay", true);
            await player.data.set("requester", message.author);
            await player.data.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            const embed = new EmbedBuilder()
                .setTitle("🎶 Autoplay Activated")
                .setDescription("`📻` | Autoplay has been **enabled**. Random songs will now continue to play after the current queue.")
                .setColor('#2ECC71')
                .addFields(
                    { name: "💽 **Current Song**", value: `[${player.queue.current.title}](${player.queue.current.uri})`, inline: true },
                    { name: "👤 **Requested by**", value: `${message.author}`, inline: true }
                )
                .setThumbnail(player.queue.current.thumbnail || client.user.displayAvatarURL())
                .setFooter({ text: 'Autoplay On', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }
    }
};
