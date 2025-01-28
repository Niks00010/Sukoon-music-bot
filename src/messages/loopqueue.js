const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "loopqueue",
    description: "Loops all songs in the queue!",
    aliases: ["repeatqueue", "queueloop"],
    run: async (client, messages, args) => {
        const player = client.manager.players.get(messages.guild.id);
        if (!player) {
            return messages.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **No song is currently playing in this guild!**")
                ]
            });
        }

        const { channel } = messages.member.voice;
        if (!channel || messages.member.voice.channel !== messages.guild.members.me.voice.channel) {
            return messages.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("🔒 **I'm not in the same voice channel as you!**")
                ]
            });
        }

        if (player.loop === 'queue') {
            player.setLoop('none');

            const embed = new EmbedBuilder()
                .setTitle('🔁 Loop Status')
                .setDescription("**Looping all songs in the queue has been:** `Disabled`")
                .setColor('#E74C3C') // Bright red for disabled status
                .setFooter({ text: 'Feel free to add more songs!', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return messages.reply({ embeds: [embed] });
        } else {
            player.setLoop('queue');

            const embed = new EmbedBuilder()
                .setTitle('🔁 Loop Status')
                .setDescription("**Looping all songs in the queue has been:** `Enabled`")
                .setColor('#F1C40F') // Bright yellow for active loop
                .setFooter({ text: 'Enjoy your endless music!', iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            return messages.reply({ embeds: [embed] });
        }
    }
};
