import fs from 'fs';
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { pineconeIndex } from './pinecone';
import { v4 as uuidv4 } from 'uuid';

export async function processAndEmbedDocument(filePath: string) {
  let dataBuffer: Buffer;
  try {
    dataBuffer = fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }

  let rawText: string;

  if (filePath.endsWith('.pdf')) {
    const pdf = await pdfParse(dataBuffer);
    rawText = pdf.text;
  } else {
    rawText = dataBuffer.toString('utf8');
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await splitter.createDocuments([rawText]);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectors = await embeddings.embedDocuments(chunks.map(chunk => chunk.pageContent));

  const upserts = vectors.map((values, idx) => ({
    id: `doc-${uuidv4()}`,
    values,
    metadata: { text: chunks[idx].pageContent },
  }));

  await pineconeIndex.upsert(upserts);
}
