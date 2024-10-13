import express from 'express';
import dotenv from 'dotenv';
import { chatCompletion } from './lib/openai.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.post('/api/get-script', async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const message = `${prompt}`;
    const response = await chatCompletion(message);
    console.log(response);
    res.json({ script: response });
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.post('/api/update-script', async (req, res) => {
  const { prompt, script, suggest } = req.body;

  try {
    const message = `${prompt} ${script} ${suggest}`;
    const response = await chatCompletion(message);
    res.json({ script: response });
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.post('/api/get-video', async (req, res) => {
  const { script } = req.body;
  return res.json(script);
});

app.get('/', (req, res) => {
  return res.json(`[server]: Server is running at http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
