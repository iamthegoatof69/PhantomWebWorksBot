const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Displays information about the server.',
  execute(interaction) {
    const { guild } = interaction;
    const serverAge = new Date() - guild.createdAt;
    const serverAgeInDays = Math.floor(serverAge / (1000 * 60 * 60 * 24));
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Server Information')
      .addFields(
        { name: 'Server Name', value: `${interaction.guild.name}` },
        { name: 'Server Age', value: `${serverAgeInDays} days`},
        { name: 'Total Members', value: `${guild.memberCount}`}     
      )
      .setThumbnail(guild.iconURL({ dynamic: true }) || '')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
