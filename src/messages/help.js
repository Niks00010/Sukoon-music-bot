const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'List of all commands.',
    run: async (client, message, args) => {
        // Get all slash commands
        const slashCommandFolders = ['Music', 'Other', 'filters', 'playlist'];
        const slashCommandsByCategory = {};

        // Organize slash commands by category
        for (const folder of slashCommandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`))
                .filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if (command.data) {
                    commands.push({
                        name: command.data.name,
                        description: command.data.description
                    });
                }
            }

            if (commands.length > 0) {
                slashCommandsByCategory[folder] = commands;
            }
        }

        // Get all prefix commands from messages folder
        const prefixCommands = [];
        const prefixCommandFiles = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith('.js'));

        for (const file of prefixCommandFiles) {
            if (file !== 'help.js') {
                const command = require(`./${file}`);
                prefixCommands.push({
                    name: command.name,
                    description: command.description || 'No description available'
                });
            }
        }

        // Create the select menu for slash command categories
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('Select a command category')
            .addOptions([
                ...Object.keys(slashCommandsByCategory).map(category => ({
                    label: category,
                    description: `View ${category} commands`,
                    value: category
                }))
            ]);

        // Create the buttons
        const prefixCommandsButton = new ButtonBuilder()
            .setCustomId('prefix-commands')
            .setLabel('Prefix Commands')
            .setEmoji('<:p_prefix:1333711186679824385>')
            .setStyle(ButtonStyle.Primary);

        const slashCommandsButton = new ButtonBuilder()
            .setCustomId('slash-commands')
            .setLabel('Slash Commands')
            .setEmoji('<:main_blue_slash:1333710920701972491>')
            .setStyle(ButtonStyle.Success);

        // const homeButton = new ButtonBuilder()
        //     .setCustomId('home')
        //     .setLabel('Home')
        //     .setStyle(ButtonStyle.Secondary);

        // Create the initial embed
        const createMainEmbed = () => {
            return new EmbedBuilder()
                .setAuthor({ name: 'Sukoon Help Menu', iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('<a:blue:1333707232839204864> Help Menu')
                .setColor('Blue')
                .setDescription(`Hey **${message.author.username}**!\nUse drop-down for more info.\n\n<:commands:1333707733907537972> **__Commands__**\n<:filters:1333708365020401668> : **Filter**\n<a:music:1333708662417526814> : **Music**\n<:ABookBlue:1333709111908503616> : **Other**\n<:playlist:1333709538918010921> : **Playlist**\n\n[Invite](https://discord.com/oauth2/authorize?client_id=452744996550869002) | [Support](https://discord.gg/RuHXuaN5xd)\n\n`)
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setImage("https://media.discordapp.net/attachments/1332021383806451823/1333151438351634625/Second_Size.gif?ex=6799d3c7&is=67988247&hm=83d54f5cf25c0d9e624c2a2044b95e393fde990bc6ba84ccb1d2d54d9fdbc358&=")
                .setTimestamp()
        };

        // Create action rows
        const selectRow = new ActionRowBuilder().addComponents(selectMenu);
        const buttonRow = new ActionRowBuilder().addComponents(prefixCommandsButton, slashCommandsButton);

        // Send initial message
        const helpMessage = await message.channel.send({
            embeds: [createMainEmbed()],
            components: [selectRow, buttonRow]
        });

        // Create collector for interactions
        const collector = helpMessage.createMessageComponentCollector({
            time: 300000 // 5 minutes
        });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'category-select') {
                const category = interaction.values[0];
                const commands = slashCommandsByCategory[category];

                const categoryEmbed = new EmbedBuilder()
                    .setTitle(`<:commands:1333707733907537972> ${category} Commands`)
                    .setColor('Blue')
                    .setDescription(commands.map(cmd =>
                        `**\`🟡\` /${cmd.name}**\n\`📓\` ${cmd.description}`
                    ).join('\n\n'))
                    .setFooter({ text: 'Use the menu to select another category' })
                    .setTimestamp();

                await interaction.update({
                    embeds: [categoryEmbed],
                    components: [selectRow, buttonRow]
                });
            }
            else if (interaction.customId === 'prefix-commands') {
                const prefixEmbed = new EmbedBuilder()
                    .setTitle('Prefix Commands')
                    .setColor('#FF0000')
                    .setDescription(prefixCommands.map(cmd =>
                        `**${process.env.prefix}${cmd.name}**\n> ${cmd.description}`
                    ).join('\n\n'))
                    .setFooter({ text: 'Click Home to go back' })
                    .setTimestamp();

                // Create button row without prefix button and select menu for prefix commands view
                const prefixButtonRow = new ActionRowBuilder().addComponents(
                    slashCommandsButton,
                );

                await interaction.update({
                    embeds: [prefixEmbed],
                    components: [prefixButtonRow] // Only show navigation buttons
                });
            }
            else if (interaction.customId === 'slash-commands') {
                await interaction.update({
                    embeds: [createMainEmbed()],
                    components: [selectRow, buttonRow]
                });
            }
            else if (interaction.customId === 'home') {
                await interaction.update({
                    embeds: [createMainEmbed()],
                    components: [selectRow, buttonRow]
                });
            }
        });

        collector.on('end', () => {
            helpMessage.edit({
                components: []
            }).catch(console.error);
        });
    }
};
