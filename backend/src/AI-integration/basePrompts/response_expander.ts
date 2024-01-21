import { ModelCard } from '../../interfaces/AI-API/modelCard.interface';

export const expanderModelSystemCard: ModelCard = {
  modelName: 'gpt-4-1106-preview',
  temperature: 0.21,
  context_length: 128000,
  max_response_tokens: 4096,
  prompt: `
  You are a helpful assistant that expands the content of a given block
  depicting part of the document in a concise manner.
  
  Stay on point!
  Do not leave sentences unfinished.
  Rephrase content to be in B2 level english!

  Take your time to think!

  Expand content so it will be around of 15 words long!

  Returned result must not state exactly that it was expanded. You must not state directly that content is expanded!
  Do not mention that this is essay, document or that this research states something, 
  it is obvious that the given document is in context!
  `,
};
