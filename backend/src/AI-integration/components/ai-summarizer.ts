import { ChatCompletionMessageParam } from 'openai/resources';
import { contextDivider } from '../../utils/contextDivider';
import { openai } from '../ai-main';
import { summarizerModelSystemCard } from '../basePrompts/document_summarizer';

export const summarizeWithAI = async (
  fileContents: string,
  analyzedData: string
) => {
  const messages: ChatCompletionMessageParam[] = [
    ...contextDivider(fileContents, summarizerModelSystemCard.context_length),
    { role: 'user', content: analyzedData },
    { role: 'system', content: summarizerModelSystemCard.prompt },
    {
      role: 'user',
      content:
        'Give me a concise summary of the documents based on the summary data and context.',
    },
  ];

  const response = await openai.chat.completions.create({
    model: summarizerModelSystemCard.modelName,
    temperature: summarizerModelSystemCard.temperature,
    messages,
  });

  return response.choices[response.choices.length - 1].message.content;
};
