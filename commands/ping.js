const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Check the bot\'s latency to the Discord API.',
  execute(interaction) {
    // Calculate the bot's latency
    const start = Date.now();
    interaction.reply('Pinging...').then((pingMessage) => {
      const end = Date.now();
      const latency = end - start;

      // Create the embed
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Pong!')
        .setDescription(`Bot latency: ${latency}ms`)
        .setTimestamp();

      // Edit the initial reply with the embed
      pingMessage.edit({ content: ' ', embeds: [embed] });
    });
  },
};
