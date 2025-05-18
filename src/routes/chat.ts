import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { pineconeIndex } from '../services/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return void res.status(400).json({ error: 'Message is required' });
  }

  try {
    // 1. Embed the user query
    const embedder = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const queryVector = await embedder.embedQuery(message);

    // 2. Search Pinecone
    const results = await pineconeIndex.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    // 3. Extract context
    const contextChunks = results.matches?.map(match => match.metadata?.text).join('\n---\n') ?? '';

    // 4. Send context + question to LLM
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.3,
      modelName: 'gpt-4',
    });

    const systemPrompt = `
You are a helpful assistant that answers questions using the following context:
${contextChunks}
Answer the question as clearly as possible.
`;

    const response = await llm.call([
      new SystemMessage(systemPrompt),
      new HumanMessage(message),
    ]);

    return void res.json({ response: response.text });
  } catch (error) {
    console.error('RAG error:', error);
    return void res.status(500).json({ error: 'RAG failed' });
  }
});

export default router;