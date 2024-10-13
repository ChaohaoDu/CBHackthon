import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export const chatCompletion = async (message) => {
  return '1';
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: message }],
    model: 'gpt-4o',
  });

  const messageContent = completion?.choices?.[0]?.message?.content;

  if (!messageContent) {
    throw new Error('Error with OpenAI');
  }
  return messageContent.trim();
};
