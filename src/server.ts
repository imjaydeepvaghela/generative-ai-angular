import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const server = express();
const port = 3000;

const googleAiStudioApiKey = 'GOOGLE_AI_STUDIO_APIKEY'; // Replace it with the generated api key

if (!googleAiStudioApiKey) {
  throw new Error('Provide GOOGLE_AI_STUDIO_API_KEY in a .env file');
}

const genAI = new GoogleGenerativeAI(googleAiStudioApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const chat = model.startChat();

server.use(express.text());
server.use(cors());

server.listen(port, () => {
  console.log('Server is running on port', port);
});

server.post('/message', async (req: Request, res: Response) => {
  const prompt: string = req.body;

  console.log('Received prompt:', prompt);

  if (!prompt) {
    return res.status(400).send('Prompt is required');
  }

  try {
    console.log('Generating response...');
    const result = await chat.sendMessageStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      console.log('Received chunk:', chunkText);
      res.write(chunkText);
    }
  } catch (err) {
    console.error('Error during message generation:', err);
    res.status(500).send('Internal Server Error');
  }

  return res.end();
});
