import { ChatCompletionMessageParam } from 'openai/resources';
import { openai } from '../ai-main';
import fs from 'fs/promises';
import { analyzerModelSystemCard } from '../basePrompts/document_analyzer';
import { contextDivider } from '../../utils/contextDivider';

export const analyzeWithAI = async (
  fileContents: string,
  assistingPrompt: string
) => {
  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: analyzerModelSystemCard.prompt },

      ...contextDivider(fileContents, analyzerModelSystemCard.context_length),
      {
        role: 'user',
        content:
          assistingPrompt || 'Make sure to analyze the content of the document',
      },
      { role: 'user', content: 'Now analyze the content of the document!' },
    ];

    const response = await openai.chat.completions.create({
      model: analyzerModelSystemCard.modelName,
      temperature: analyzerModelSystemCard.temperature,
      messages,
    });

    return response.choices[response.choices.length - 1].message.content;
  } catch (error) {
    throw error;
  }
};
