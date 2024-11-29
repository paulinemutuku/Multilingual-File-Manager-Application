const express = require('express');
const router = express.Router();
const fs = require('fs');
const { TranslationServiceClient } = require('@google-cloud/translate');

const client = new TranslationServiceClient();
const projectId = 'your-project-id';
const location = 'global';
const parent = `projects/${projectId}/locations/${location}`;

const translateText = async (text, targetLanguage) => {
  const [response] = await client.translateText({
    parent,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLanguage,
  });
  return response.translations[0].translatedText;
};

router.post('/translate-file', async (req, res) => {
  try {
    const { inputFilePath, outputFilePath, targetLanguage } = req.body;
    const content = await fs.promises.readFile(inputFilePath, 'utf8');
    const translatedContent = await translateText(content, targetLanguage);
    await fs.promises.writeFile(outputFilePath, translatedContent, 'utf8');
    res.json({ message: `File translated and saved to ${outputFilePath}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
