const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player) => {
    if (!player || !player.textId) {
        console.error("Player or textId is undefined.");
        return;
    }

    const channel = client.channels?.cache?.get(player.textId);
    if (!channel) {
        console.error(`Could not find channel with ID: ${player.textId}`);
        return;
    }

    if (player.data.get("stay")) return;

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle("🎶 Music Playback Ended")
        .setDescription("`<a:playing_song:1332981272963973193>` | **The song has ended.** The queue is now empty and the player has been stopped.")
    .setImage("https://media.discordapp.net/attachments/1332293757256601640/1333390754437005344/Second_Size.gif?ex=6798b869&is=679766e9&hm=5fbb6fcbc527ef59fccc9bed745107922bdc44563cfbc207c1b48d2323b68e3c&")
        .setFooter({ text: "Thanks for listening! 🎧", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

    await channel.send({ embeds: [embed] });

    return player.destroy();
};
