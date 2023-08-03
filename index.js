const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Command handling setup
client.commands = new Map();

// Function to register slash commands
async function registerCommands() {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
  try {
    await client.application?.commands.set([...client.commands.values()]);
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

// Welcome message role buttons data
const roleButtonData = [
  { roleId: '1136460090745036800', label: '📢 Announcement' },
  { roleId: '1136460234290888724', label: '📣 Updates' },
  { roleId: '1136460341056917565', label: '🤝 Partners' },
  { roleId: '1136460234970378333', label: '📊 Polls' },
  { roleId: '1118357404896202804', label: '💀 Chat Revive' },
];

// Function to create the role buttons embed
function createRoleEmbed() {
  const embed = new EmbedBuilder()
    .setColor('#3498DB')
    .setTitle('Ping Roles')
    .setDescription('Welcome to our notification settings! Take control of when you get notified by clicking the buttons below to decide your preferences and stay connected seamlessly.');
  const row = new ActionRowBuilder();
  for (const data of roleButtonData) {
    const button = new ButtonBuilder()
      .setCustomId(data.label)
      .setLabel(data.label)
      .setStyle(ButtonStyle.Primary);

    row.addComponents(button);
  }

  return { embeds: [embed], components: [row] };
}

// Function to update roles based on button interactions
async function updateRoles(interaction) {
  const roleId = roleButtonData.find((data) => data.label === interaction.customId)?.roleId;

  if (!roleId) {
    return;
  }

  const role = interaction.guild.roles.cache.get(roleId);

  if (!role) {
    return;
  }

  const member = interaction.member;
  if (!member) return;

  if (member.roles.cache.has(roleId)) {
    await member.roles.remove(role);
    const embed = new EmbedBuilder()
        .setTitle('Role Removed')
        .setDescription(`You have been removed from the role ${role.name}`)
        .setColor('#ff0000');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else {
    await member.roles.add(role);
    const embed = new EmbedBuilder()
        .setTitle('Role Added')
        .setDescription(`You have been given the role ${role.name}`)
        .setColor('#00ff00');
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

// Event when the bot is ready
client.once('ready', () => {
  console.log('Bot is ready!');
  registerCommands();
});

// Event when a message is created in the server
client.on('messageCreate', async (message) => {
  if (message.content === '!rolesembed') {
    const { embeds, components } = createRoleEmbed();
    await message.channel.send({ embeds, components });
  }
});

// Event when any interaction (button, slash command) is created
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton() && !interaction.isCommand()) return;

  if (interaction.isButton()) {
    await updateRoles(interaction);
  } else if (interaction.isCommand()) {
    const { commandName } = interaction;
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  }
});

// Event when a new member joins the server
client.on('guildMemberAdd', async (member) => {
  const welcomeChannelId = '1136128963907944629';
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
  if (!welcomeChannel) return;

  const welcomeMsg = `Welcome, <@${member.user.id}>! We are glad to have you here. \n Enjoy your time in our server!`;

  const embed = new EmbedBuilder()
    .setColor('#3498DB')
    .setTitle(`Welcome @${member.user.username}`)
    .setDescription(welcomeMsg)
    .setImage(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  await welcomeChannel.send({ embeds: [embed] });
});

const token = process.env.TOKEN;
client.login(token);
