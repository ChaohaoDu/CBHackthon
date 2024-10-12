import express from 'express';
import dotenv from 'dotenv';
import { chatCompletion } from './lib/openai.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/get-script', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const message = `${prompt}`;
    const response = await chatCompletion(message);
    res.json({ response });
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.post('/api/get-video', async (req, res) => {
  const { script } = req.body;
  return res.json(script);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
