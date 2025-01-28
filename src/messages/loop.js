const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "loop",
    description: "Loops the current song or the entire queue!",
    aliases: ["repeat", "loopqueue"],
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

        const choice = args[0];

        if (!choice || !['current', 'queue'].includes(choice)) {
            return messages.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **You must specify 'current' or 'queue' for the loop mode!**")
                ]
            });
        }

        if (choice === 'current') {
            if (player.loop === 'none') {
                player.setLoop('track');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Current song has been:** \`Looped\``)
                    .setColor('#F1C40F') // Bright yellow for active loop
                    .setFooter({ text: 'Enjoy your music!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return messages.reply({ embeds: [embed] });
            } else {
                player.setLoop('none');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Current song has been:** \`Unlooped\``)
                    .setColor('#E74C3C') // Bright red for unlooped status
                    .setFooter({ text: 'Happy listening!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return messages.reply({ embeds: [embed] });
            }
        } else if (choice === 'queue') {
            if (player.loop === 'queue') {
                player.setLoop('none');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Looping all has been:** \`Disabled\``)
                    .setColor('#E74C3C') // Bright red for disabled status
                    .setFooter({ text: 'Feel free to add more songs!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return messages.reply({ embeds: [embed] });
            } else {
                player.setLoop('queue');

                const embed = new EmbedBuilder()
                    .setTitle('🔁 Loop Status')
                    .setDescription(`**Looping all has been:** \`Enabled\``)
                    .setColor('#F1C40F') // Bright yellow for active loop
                    .setFooter({ text: 'Enjoy your endless music!', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                return messages.reply({ embeds: [embed] });
            }
        }
    }
};
