import express from 'express';
import upload from '../middleware/uploadFileMiddleware';
import textract from 'textract';
import fs from 'fs/promises'

const router = express.Router();

// Uploads file, extracts text, and returns combined text
router.post('/uploadFile', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No files uploaded')
    }

    let combinedText = ''
    
    for (const file of req.files) {
      const text = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(file.path, (error, text) => {
          if (error) reject(error)
          else resolve(text)
        })
      })

      combinedText += text + '\n'

      // Delete the file after processing
      await fs.unlink(file.path)
    }

    res.send({ combinedText: combinedText })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message })
    } else {
      res.status(500).send({ error: 'An unknown error occurred' })
    }
  }
})

export default router
