import express from 'express';
import upload from '../middleware/uploadFileMiddleware';
import textract from 'textract';
import fs from 'fs'; // For synchronous operations
import fsp from 'fs/promises'; // For asynchronous operations
import { getAIMindMap } from '../AI-integration/ai-main';
import {
  processAndAccumulateNodes,
  processFlowchartNode,
} from '../miro/flowCharter';
import { getEnvOrThrow } from '../utils/config';
import { createConnectors, createIdPairs } from '../miro/connectors';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Uploads file, extracts text, and returns combined text
router.post('/uploadFile', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No files uploaded');
    }

    let combinedText = '';

    for (const file of req.files) {
      const text = await new Promise((resolve, reject) => {
        const options = {
          preserveLineBreaks: true,
          encoding: 'UTF-8',
        };
        textract.fromFileWithPath(file.path, options, (error, text) => {
          if (error) reject(error);
          else resolve(text);
        });
      });

      combinedText += text + '\n';

      // Delete the file after processing
      await fsp.unlink(file.path);
    }

    // Log the combined text and keywords to the console
    const assistingPrompt = req.body.keywords;

    console.log(assistingPrompt);
    console.log(combinedText);

    const mindMapJSON = await getAIMindMap(combinedText, assistingPrompt);

    const nodes = await processAndAccumulateNodes(
      mindMapJSON,
      getEnvOrThrow('TEMPTOKEN'),
      getEnvOrThrow('MIRO_BOARD_ID')
    );

    const idPairs = createIdPairs(nodes);

    await createConnectors(
      idPairs,
      getEnvOrThrow('TEMPTOKEN'),
      getEnvOrThrow('MIRO_BOARD_ID')
    );

    res.send({ combinedText: combinedText });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
