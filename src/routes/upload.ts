import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { processAndEmbedDocument } from '../services/embedder';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return void res.status(400).json({ error: 'File is required' });
  }

  try {
    await processAndEmbedDocument(file.path);
    fs.unlinkSync(file.path); // Clean up after upload
    return void res.json({ status: 'Embedded and stored in Pinecone' });
  } catch (err) {
    console.error(err);
    return void res.status(500).json({ error: 'Embedding failed' });
  }
});

export default router;
