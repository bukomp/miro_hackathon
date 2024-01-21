export interface ModelCard {
  modelName: string;
  url?: string;
  temperature: number;
  context_length: number;
  max_response_tokens?: number;
  prompt: string;
  exampleResponse?: string;
}
