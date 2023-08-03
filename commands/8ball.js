const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'magic8ball',
  description: 'Ask the magic 8-ball a question.',
  options: [
    {
      name: 'question',
      description: 'Your question',
      type: 3, // Type 3 represents STRING
      required: true,
    },
  ],
  async execute(interaction) {
    const responses = [
      "🎱 It is certain.",
      "🎱 It is decidedly so.",
      "🎱 Without a doubt.",
      "🎱 Yes, definitely.",
      "🎱 You may rely on it.",
      "🎱 As I see it, yes.",
      "🎱 Most likely.",
      "🎱 Outlook good.",
      "🎱 Yes.",
      "🎱 Signs point to yes.",
      "🎱 Reply hazy, try again.",
      "🎱 Ask again later.",
      "🎱 Better not tell you now.",
      "🎱 Cannot predict now.",
      "🎱 Concentrate and ask again.",
      "🎱 Don't count on it.",
      "🎱 My reply is no.",
      "🎱 My sources say no.",
      "🎱 Outlook not so good.",
      "🎱 Very doubtful.",
    ];

    const question = interaction.options.getString('question');
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setColor('#CC8899')
      .setTitle('Magic 8-Ball')
      .setDescription(`**Question:** ${question}\n**Response:** ${randomResponse}`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
