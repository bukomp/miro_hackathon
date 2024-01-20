import { ModelCard } from '../../interfaces/AI-API/modelCard.interface';

export const expanderModelSystemCard: ModelCard = {
  modelName: 'gpt-3.5-turbo-1106',
  temperature: 0.21,
  context_length: 4096,
  max_response_tokens: 36,
  prompt: `
  You are a helpful assistant that expands the content of a given block
  depicting part of the document in a concise manner based on the context, document analysis, and summary.
  `,
};
