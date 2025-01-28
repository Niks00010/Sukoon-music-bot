const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "join",
    description: "Summon the bot to your voice channel.",
    aliases: ["join"],
    run: async (client, message, args) => {
        const { channel } = message.member.voice;

        if (!channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("❌ **You need to be in a voice channel to summon the bot!**")
                ]
            });
        }

        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Connect)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("⚠️ **I don't have permission to join your voice channel!**")
                ]
            });
        }

        if (!channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.Speak)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("🔇 **I don't have permission to speak in your voice channel!**")
                ]
            });
        }

        client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        const embed = new EmbedBuilder()
        
            .setDescription(`<a:emoji:1333400069986320404> **Successfully joined:** \`${channel.name}\``)
            .setColor('#3498DB')
            .setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
