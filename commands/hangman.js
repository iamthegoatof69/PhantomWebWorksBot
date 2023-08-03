const { EmbedBuilder } = require('discord.js');

const words = [
  { word: 'hangman', category: 'Games' },
  { word: 'banana', category: 'Fruits' },
  { word: 'javascript', category: 'Programming' },
  { word: 'discord', category: 'Apps' },
  { word: 'programming', category: 'Jobs' },
  { word: 'gaming', category: 'Hobbies' },
  { word: 'apple', category: 'Fruits' },
  { word: 'computer', category: 'Devices' },
  { word: 'elephant', category: 'Animals' },
  { word: 'mango', category: 'Fruits' },
  { word: 'internet', category: 'Technology' },
  { word: 'pencil', category: 'Stationery' },
  { word: 'keyboard', category: 'Devices' },
  { word: 'coffee', category: 'Beverages' },
  { word: 'television', category: 'Electronics' },
  { word: 'sunflower', category: 'Plants' },
  { word: 'mountain', category: 'Landforms' },
  { word: 'hamburger', category: 'Food' },
  { word: 'oxygen', category: 'Elements' },
  { word: 'rainbow', category: 'Weather' },
];

module.exports = {
  name: 'hangman',
  description: 'Play a game of hangman!',
  async execute(interaction) {
    const selectedWordObject = words[Math.floor(Math.random() * words.length)];
    const word = selectedWordObject.word;
    const category = selectedWordObject.category;
    const wordArray = word.split('');
    const guessedLetters = new Set();
    const maxAttempts = 6;
    let attempts = 0;

    const embed = new EmbedBuilder()
      .setTitle('Hangman Game')
      .setDescription('Guess the word by entering one letter at a time!')
      .addFields(
        { name: 'Category', value: category },
        { name: 'Word', value: displayWord(wordArray, guessedLetters) },
        { name: 'Attempts', value: `${attempts}/${maxAttempts}` },
        { name: 'Time Left', value: '5:00' }
      )
      .setColor('#CC8899');

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });

    const filter = (response) => {
      return response.author.id === interaction.user.id && /^[a-zA-Z]$/.test(response.content);
    };

    const collector = message.channel.createMessageCollector({ filter, time: 300000, max: maxAttempts });

    let countdownInterval;

    collector.on('collect', (response) => {
      const letter = response.content.toLowerCase();
      if (guessedLetters.has(letter)) {
        return interaction.followUp(`You've already guessed ${letter}!`);
      }
      guessedLetters.add(letter);

      if (wordArray.includes(letter)) {
        if (wordArray.every((char) => guessedLetters.has(char))) {
          clearInterval(countdownInterval);
          collector.stop('won');
        }
      } else {
        attempts++;
        if (attempts === maxAttempts) {
          clearInterval(countdownInterval);
          collector.stop('lost');
        }
      }

      embed
        .spliceFields(1, 1, { name: 'Word', value: displayWord(wordArray, guessedLetters) })
        .spliceFields(2, 1, { name: 'Attempts', value: `${attempts}/${maxAttempts}` });

      message.edit({ embeds: [embed] });
    });

    countdownInterval = setInterval(() => {
      const timeLeft = (300000 - collector.collected.size * 20000) / 60000;
      embed.spliceFields(3, 1, { name: 'Time Left', value: `${timeLeft.toFixed(2)}:00` });
      message.edit({ embeds: [embed] });
    }, 20000);

    collector.on('end', (_, reason) => {
      clearInterval(countdownInterval);
      if (reason === 'won') {
        interaction.followUp('Congratulations, you won! The word was ' + word);
      } else if (reason === 'lost') {
        interaction.followUp('You ran out of attempts! The word was ' + word);
      } else {
        interaction.followUp('Time is up! The word was ' + word);
      }
    });
  },
};

function displayWord(wordArray, guessedLetters) {
  return wordArray.map((char) => (guessedLetters.has(char) ? char : '_')).join(' ');
}
