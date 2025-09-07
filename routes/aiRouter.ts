import { Request, Response, Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

import OpenAI from 'openai';

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----------VALIDATE TOKEN -----------------
router.post('/assistant', verifyToken, async (req: Request, res: Response) => {
  const { inputText } = req.body;

  if (!inputText) {
    return res
      .status(400)
      .send({ message: 'Input text is required', success: false });
  }

  try {
    const response = await client.responses.create({
      model: 'gpt-5-nano',
      reasoning: { effort: 'low' },

      input: [
        {
          role: 'assistant',
          content:
            "You are finance expert. You can help with anything related to finance. Keep your answers short and concise. Maximum 5 sentences. Don't use follow up questions.",
        },
        {
          role: 'user',
          content: inputText,
        },
      ],
    });
    res.status(200).send({ message: response.output_text, success: true });
  } catch (error) {
    console.error('Error generating response:', error);
    res
      .status(500)
      .send({ message: 'Error generating response', success: false });
  }
});

export default router;
