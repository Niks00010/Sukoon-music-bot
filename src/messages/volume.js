const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'Adjust the volume of the bot.',

    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');

        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) {
            return message.reply('🔇 **You need to be in the same voice channel as the bot to change the volume!**');
        }

        const volumeAmount = args[0]; // Get the volume amount from the command arguments

        if (!volumeAmount) {
            return message.reply(`🔊 **Current volume:** ${player.volume}%`);
        }

        if (isNaN(volumeAmount) || volumeAmount < 1 || volumeAmount > 100) {
            return message.reply('⚠️ **Please provide a valid volume amount between 1 and 100.**');
        }

        await player.setVolume(Number(volumeAmount));

        const embed = new EmbedBuilder()
            .setDescription(`\`🔉\` | *Volume has been set to:* \`${volumeAmount}%\``)
            .setColor('Orange')
            .setFooter({ text: 'Enjoy your music at the perfect volume! 🎶' });

        return message.reply({ embeds: [embed] });
    }
};
