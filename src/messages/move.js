const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Change a song\'s position in the queue.')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('The queue number of the song you want to move')
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('The position in the queue you want to move the song to')
                .setRequired(true)
                .setMinValue(1)
        ),

    run: async (client, messages, args) => {
        const player = client.manager.players.get(messages.guild.id);
        if (!player || player.queue.length === 0) {
            return messages.reply('🚫 **No music is currently playing or the queue is empty in this guild!**');
        }

        const { channel } = messages.member.voice;
        if (!channel || messages.member.voice.channel !== messages.guild.members.me.voice.channel) {
            return messages.reply('🔇 **I\'m not in the same voice channel as you!**');
        }

        const fromIndex = messages.options.getInteger('from') - 1; // Convert to 0-based index
        const toIndex = messages.options.getInteger('to') - 1; // Convert to 0-based index

        if (fromIndex < 0 || fromIndex >= player.queue.length) {
            return messages.reply('⚠️ **Song not found at that position.**');
        }

        if (toIndex < 0 || toIndex >= player.queue.length) {
            return messages.reply('⚠️ **Target position is invalid.**');
        }

        const song = player.queue[fromIndex];

        // Check if the song is already at the target position
        if (fromIndex === toIndex) {
            return messages.reply('⚠️ **The song is already in that position.**');
        }

        // Remove and insert the song at the new position
        player.queue.splice(fromIndex, 1);
        player.queue.splice(toIndex, 0, song);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`🎶 **Moved** • [${song.title}](${song.uri}) **to position** ${toIndex + 1}`);

        return messages.reply({ embeds: [embed] });
    }
};
