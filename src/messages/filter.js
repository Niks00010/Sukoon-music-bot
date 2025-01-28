const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'filter',
    description: 'Apply audio filters to the player.',
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply('🚫 **No music is currently playing in this guild!**');

        // Ensure args[0] is the filter name
        const filterName = args[0];

        if (!filterName) {
            return message.reply('🚫 **You must specify a filter!**');
        }

        switch (filterName.toLowerCase()) {
            case 'eightd':
                await player.filter('eightD');
                message.reply('eightD filter is enabled.');
                break;
            case 'soft':
                await player.filter('soft');
                message.reply('Soft bass filter is enabled.');
                break;
            case 'speed':
                await player.setFilter('speed'); // Adjust as necessary for your implementation
                message.reply('Playback speed filter is enabled.');
                break;
            case 'karaoke':
                await player.filter('karaoke');
                message.reply('Karaoke filter is enabled.');
                break;
            case 'nightcore':
                await player.filter('nightcore');
                message.reply('Nightcore filter is enabled.');
                break;
            case 'pop':
                await player.filter('pop');
                message.reply('Pop equalizer settings are applied.');
                break;
            case 'vaporwave':
                await player.filter('vaporwave');
                message.reply('Vaporwave filter is enabled.');
                break;
            case 'bass':
                await player.filter('bass');
                message.reply('Bass boost is enabled.');
                break;
            case 'party':
                await player.filter('party');
                message.reply('Party audio settings are applied.');
                break;
            case 'earrape':
                await player.filter('earrape');
                message.reply('Earrape filter is enabled.');
                break;
            case 'equalizer':
                await player.filter('equalizer');
                message.reply('Custom equalizer settings are applied.');
                break;
            case 'electronic':
                await player.filter('electronic');
                message.reply('Electronic audio settings are applied.');
                break;
            case 'radio':
                await player.filter('radio');
                message.reply('Radio audio settings are applied.');
                break;
            case 'tremolo':
                await player.filter('tremolo');
                message.reply('Tremolo effect is enabled.');
                break;
            case 'treblebass':
                await player.filter('treblebass');
                message.reply('Treble and bass levels adjusted.');
                break;
            case 'vibrato':
                await player.filter('vibrato');
                message.reply('Vibrato effect is enabled.');
                break;
            case 'china':
                await player.filter('china');
                message.reply('China filter is enabled.');
                break;
            case 'chimpunk':
                await player.filter('chimpunk');
                message.reply('Chipmunk effect is enabled.');
                break;
            case 'darthvader':
                await player.filter('darthvader');
                message.reply('Darth Vader effect is enabled.');
                break;
            case 'daycore':
                await player.filter('daycore');
                message.reply('Daycore effect is enabled.');
                break;
            case 'doubletime':
                await player.filter('doubletime');
                message.reply('Double time effect is enabled.');
                break;
            case 'pitch':
                await player.filter('pitch');
                message.reply('Pitch adjustment is enabled.');
                break;
            case 'rate':
                await player.filter('rate');
                message.reply('Playback rate is adjusted.');
                break;
            case 'slow':
                await player.filter('slow');
                message.reply('Slow playback is enabled.');
                break;
            case 'clear':
                await player.filter('clear');
                message.reply('All audio filters have been cleared.');
                break;
            default:
                message.reply('🚫 **Invalid filter option!**');
                break;
        }
    }
};
