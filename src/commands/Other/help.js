const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require ('discord.js');
const fs = require ('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of all commands.'),

    async execute(interaction, client) {
        const commandFolders = fs.readdirSync('./src/commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const { default: command } = await import(`./../${folder}/${file}`);
                commands.push({ name: command.data.name, description: command.data.description });
            }

            commandsByCategory[folder] = commands;
        }

        const dropdownOptions = Object.keys(commandsByCategory).map(folder => ({
            label: folder,
            value: folder
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('Select a category')
            .addOptions(...dropdownOptions.map(option => ({
                label: option.label,
                value: option.value
            })));

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Sukoon Help Menu', iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`})
            .setTitle('<a:blue:1333707232839204864> Help Menu')
            .setColor('Blue')
            .setDescription(`Hey **${interaction.username}**!\nUse drop-down for more info.\n\n<:commands:1333707733907537972> **__Commands__**\n<:filters:1333708365020401668> : **Filter**\n<a:music:1333708662417526814> : **Music**\n<:ABookBlue:1333709111908503616> : **Other**\n<:playlist:1333709538918010921> : **Playlist**\n\n[Invite](https://discord.com/oauth2/authorize?client_id=452744996550869002) | [Support](https://discord.gg/RuHXuaN5xd)\n\n`)
            .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setImage("https://media.discordapp.net/attachments/1332021383806451823/1333151438351634625/Second_Size.gif?ex=6799d3c7&is=67988247&hm=83d54f5cf25c0d9e624c2a2044b95e393fde990bc6ba84ccb1d2d54d9fdbc358&=")
            .setTimestamp()

            const row = new ActionRowBuilder()
			.addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.isStringSelectMenu() && i.customId === 'category-select';
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            const selectedCategory = i.values[0];
            const categoryCommands = commandsByCategory[selectedCategory];

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`<:commands:1333707733907537972> ${selectedCategory} Commands`)
                .setDescription('List of all commands in this category.')
                .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setImage("https://media.discordapp.net/attachments/1332021383806451823/1333151438351634625/Second_Size.gif?ex=6799d3c7&is=67988247&hm=83d54f5cf25c0d9e624c2a2044b95e393fde990bc6ba84ccb1d2d54d9fdbc358&=")
                .setColor('Blue')
                .addFields(categoryCommands.map(command => ({
                    name: `\`🟡\` ${command.name}`,
                    value: `\`📓\` ${command.description}`
                })));

            await i.update({ embeds: [categoryEmbed] });
        });
    }
};
