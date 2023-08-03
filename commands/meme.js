const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'meme',
  description: 'Generate a meme every time you use this command',
  async execute(interaction) {
    try {
      const response = await fetch(`https://www.reddit.com/r/memes/random/.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch meme.');
      }

      const memeData = await response.json();
      const meme = memeData[0].data.children[0].data;

      const title = meme.title;
      const image = meme.url;
      const author = meme.author;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(title)
        .setImage(image)
        .setURL(image)
        .setFooter({ text: author }); // Pass an object with the 'text' property

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error generating meme:', error);
      await interaction.reply({ content: 'Failed to generate a meme. Please try again later.', ephemeral: true });
    }
  },
};
