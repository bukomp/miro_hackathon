import { ModelCard } from '../../interfaces/AI-API/modelCard.interface';

export const analyzerModelSystemCard: ModelCard = {
  modelName: 'gpt-4-1106-preview',
  temperature: 0.21,
  context_length: 16384,
  prompt: `
  You are a helpful assistant that analyzes the content of a document in a concise manner. 
  You must be able to analyze the content of the document and return a concise analysis of the document.
  `,
};
