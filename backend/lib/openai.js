import OpenAI from 'openai';

export const chatCompletion = async (message) => {
  const completion = await OpenAI.chat.completions.create({
    message,
    model: 'gpt-4o',
  });

  const messageContent = completion?.choices?.[0]?.message?.content;

  if (!messageContent) {
    throw new Error('Error with OpenAI');
  }
  return messageContent.trim();
};
