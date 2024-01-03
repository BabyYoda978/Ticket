const Discord = require("discord.js");

const { GatewayIntentBits } = require('discord.js');

const { ActivityType } = require("discord.js");

const sourcebin = require('sourcebin');
const config = require("./config.json");

// DB
const { QuickDB } = require('quick.db');
global.db = new QuickDB();
//

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        '32767'
    ]
});

global.embed_color = config.client.embed;

module.exports = client

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply({ content: `Erro, este comando não existe`, ephemeral: true });

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction)

    }
});

client.on("ready", () => {
    console.log(`👋 Ola`)
    console.log(`🤖 Meu nome e ${client.user.username}`)
    console.log(`💔 eu tenho ${client.users.cache.size} amigos`)
    console.log(`👨 mais ${client.guilds.cache.size} grupos`)
});

/*============================= | STATUS RICH PRESENCE | =========================================*/

client.on("ready", () => {
    const messages = [
        `🤖 Sempre ajudando`,
        `🎫 Melhor Bot Ticket`,
        `🌐 Created by ${config.ticket.credits}`
    ]

    var position = 0;

    setInterval(() => client.user.setPresence({
        activities: [{
            name: `${messages[position++ % messages.length]}`,
            type: ActivityType.Playing,
            url: 'https://www.youtube.com/watch?v=a3DxVqMwUAQ'
        }]
    }), 1000 * 10);

    client.user.setStatus("online");
});


/*============================= | Import handler | =========================================*/

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.client.token)

/*============================= | SYSTEM TICKET | =========================================*/

client.on("interactionCreate", require('./events/startTicket').execute);
/*============================= | Anti OFF | =========================================*/

// process.on('multipleResolves', (type, reason, promise) => {
//     return;
// });
// process.on('unhandRejection', (reason, promise) => {
//     return;
// });
// process.on('uncaughtException', (error, origin) => {
//     return;
// });
// process.on('uncaughtException', (error, origin) => {
//     return;
// });


process.on('multipleResolves', (type, reason, promise) => {
    console.log(`🚫 Erro Detectado\n\n` + type, promise, reason)
});
process.on('unhandRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});