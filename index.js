require('dotenv').config()
require('events').EventEmitter.defaultMaxListeners = 15;

const { Client, Events , GatewayIntentBits, Partials, ActivityType, REST, Routes, Collection } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ], 
  partials: [
    Partials.User, 
    Partials.Message, 
    Partials.Reaction, 
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.ThreadMember
  ],
});

//const keepAlive = require('./server');

const fs = require('fs');
const commands = {};

const firebaseAdminInit = require('./modules/firebaseAdminInit');

//msg-commands
const msgfiles = fs.readdirSync('./msg-commands');
const msgjsFiles = msgfiles.filter(file => file.endsWith('.js'));
msgjsFiles.forEach(commandFile => {
  const msgcommand = require(`./msg-commands/${commandFile}`)
  if(msgcommand.prefix && msgcommand.fn)
  commands[msgcommand.prefix] = msgcommand.fn
});

//auto-commands
const autofiles = fs.readdirSync('./auto-commands')
const autojsFiles = autofiles.filter(file => file.endsWith('.js'));
autojsFiles.forEach(commandFile=> {
  const autocommand = require(`./auto-commands/${commandFile}`)
  client.once(Events.ClientReady , () => {
    autocommand(client);
  })
});

//Firebase
firebaseAdminInit();

//express
//keepAlive();

client.login(process.env.DISCORD_BOT_TOKEN);
client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} is online now!`);

  //setActivity
  client.user.setActivity('窩不知道', { type: ActivityType.Playing });

  const slashcommandfiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))
  const slashcommands = [];
  client.commands = new Collection();
  
  for (const file of slashcommandfiles){
    const slashcommand = require(`./slashcommands/${file}`);
    slashcommands.push(slashcommand.data.toJSON());
    client.commands.set(slashcommand.data.name, slashcommand);
  };

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
  
  (async () => {
      try {
        console.log('Registering slash commands...');
        client.guilds.cache.forEach(async r => {
          const guildID = r.id;
          await rest.put(
              Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildID), {
                body: slashcommands
              });
          console.log(`Slash commands registered.`);
        });
      } catch (err) {
          console.error(err);
      };
  })();
});

client.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if(!command) return;

  try{
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: 'An error occurred.',
      ephemeral: true,
    })
  };
});


client.on('messageCreate', async msg => {
  const prefix = msg.content.split(' ')[0]
  if (commands[prefix] === undefined || msg.author.bot){
      return
  }
  commands[prefix](msg)
})


//Handle Error
client.on(Events.ShardError, error => {
	console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});