const { EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

const languageChoices = [
  // List of language choices (80 languages in this example)
  { name: 'Automatic', value: 'auto' },
  { name: 'Afrikaans', value: 'af' },
  { name: 'Arabic', value: 'ar' },
  { name: 'Chinese Simplified', value: 'zh-cn' },
  // Add more language choices here...
  { name: 'Zulu', value: 'zu' },
  { name: 'Bengali', value: 'bn' },
  { name: 'Bulgarian', value: 'bg' },
  { name: 'Catalan', value: 'ca' },
  { name: 'Croatian', value: 'hr' },
  { name: 'Czech', value: 'cs' },
  { name: 'Danish', value: 'da' },
  { name: 'Dutch', value: 'nl' },
  { name: 'English', value: 'en' },
  { name: 'Esperanto', value: 'eo' },
  { name: 'Estonian', value: 'et' },
  { name: 'Finnish', value: 'fi' },
  { name: 'French', value: 'fr' },
  { name: 'Galician', value: 'gl' },
  { name: 'Georgian', value: 'ka' },
  { name: 'German', value: 'de' },
  { name: 'Greek', value: 'el' },
  { name: 'Haitian', value: 'ht' },
  { name: 'Hebrew', value: 'iw' },
  // Add more language choices here...
];

module.exports = {
  name: 'translate',
  description: 'Translate your messages to a different language.',
  options: [
    {
      name: 'text',
      description: 'The text you want to translate.',
      type: 3, // Type 3 represents STRING
      required: true,
    },
    {
      name: 'from',
      description: 'Choose a language to translate from.',
      type: 3, // Type 3 represents STRING
      required: true,
      choices: languageChoices,
    },
    {
      name: 'to',
      description: 'Choose a language to translate to.',
      type: 3, // Type 3 represents STRING
      required: true,
      choices: languageChoices,
    },
  ],
  async execute(interaction, client) {
    const msg = interaction.options.getString('text');
    const from = interaction.options.getString('from');
    const to = interaction.options.getString('to');

    try {
      const translated = await translate(msg, { from, to });

      const embed = new EmbedBuilder()
        .setTitle('Google Translate')
        .setColor('#CC8899')
        .addFields(
          { name: 'Original Message', value: msg },
          { name: 'Language From', value: from},
          { name: 'Language To', value: to},
          { name: 'Translated Message', value: translated.text }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error translating text:', error);
      interaction.reply({ content: 'An error occurred while translating the text.', ephemeral: true });
    }
  },
};
