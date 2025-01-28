const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'twentyfourseven',
    description: 'Toggle 24/7 mode in the voice channel',

    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No song is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **You need to be in the same voice channel as the bot!**');
        }

        const isActive = player.data.get("stay");
        await player.data.set("stay", !isActive);

        const status = isActive ? 'Deactivated' : 'Activated';
        const emoji = isActive ? '🌅' : '🌈';
        const description = `**24/7 Mode has been:** \`${status}\``;

        const embed = new EmbedBuilder()
            .setColor(isActive ? 'Red' : 'Green')
            .setDescription(`${emoji} ${description}`)
            .setFooter({ text: 'Enjoy your endless music! 🎶' });

        return message.reply({ embeds: [embed] });
    }
};
