import { ModelCard } from '../../interfaces/AI-API/modelCard.interface';

export const summarizerModelSystemCard: ModelCard = {
  modelName: 'gpt-3.5-turbo-1106',
  temperature: 0.21,
  context_length: 16384,
  prompt: `
  You are a helpful assistant that summarizes the content of a document in a concise manner.
  You will be given a document and you will return a concise summary of the document.
  You must be able to summarize the content of the document and return a concise summary of the document.
  You must divide the document into smaller idea blocks.
  `,
};
