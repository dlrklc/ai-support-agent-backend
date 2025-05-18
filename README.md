# AI Support Agent Backend

This is the backend for an AI-powered support agent. It processes user queries, retrieves relevant context from a Pinecone vector database, and generates responses using OpenAI's GPT models.

## Features

- **Document Embedding**: Upload documents (PDF or text) to generate embeddings and store them in Pinecone for retrieval.
- **Contextual Question Answering**: Retrieve relevant context from Pinecone and use OpenAI's GPT models to answer user queries.
- **REST API**: Exposes endpoints for chat and document upload.

## Prerequisites

- Node.js (v16 or higher)
- TypeScript
- Pinecone account and API key
- OpenAI API key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dlrklc/ai-support-agent-backend.git
   cd ai-support-agent-backend
2. Install dependencies:
   
   ```bash
   npm install
4. Create a .env file in the root directory and configure the following variables:
   
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=your_pinecone_index_name
   PORT=5000
6. Build the project
   
   ```bash
   npm run build

## Usage
Start the server:

```bash
npm start
```
The server will run on the port specified in the .env file (default: 5000).

## Dependencies
Express: Web framework for building RESTful APIs.

LangChain: Framework for building applications with large language models (LLMs).

OpenAI: Used for generating text embeddings and responses.

Pinecone: Vector database for storing and querying text embeddings.

Multer: Middleware for handling multipart/form-data (file uploads).

pdf-parse: Utility for extracting text content from PDF files.

