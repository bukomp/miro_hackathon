import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { contextDivider } from '../../utils/contextDivider';
import { openai } from '../ai-main';
import { structurizerModelSystemCard } from '../basePrompts/response_structurizer';
import { MindMapNode } from '../../interfaces/MindMapNode.interface';

export const structurizeWithAI = async (
  fileContents: string,
  analyzedData: string,
  summarizedData: string,
  assistingPrompt: string
): Promise<MindMapNode> => {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'assistant', content: structurizerModelSystemCard.exampleResponse },
    ...contextDivider(fileContents, structurizerModelSystemCard.context_length),
    { role: 'user', content: analyzedData },
    { role: 'user', content: summarizedData },
    {
      role: 'user',
      content:
        assistingPrompt ||
        'Make sure to structurize the content of the document.',
    },
    { role: 'system', content: structurizerModelSystemCard.prompt },
    {
      role: 'user',
      content:
        'Now structurize the content of the document and return the structurized version of the document.',
    },
  ];

  let response = await openai.chat.completions.create({
    model: structurizerModelSystemCard.modelName,
    temperature: structurizerModelSystemCard.temperature,
    messages,
  });

  console.log(
    'is JSON:',
    validateStringIsOfJSONFormat(
      response.choices[response.choices.length - 1].message.content
    ),
    '\nStructurizing:',
    response.choices[response.choices.length - 1].message.content
  );

  while (
    !validateStringIsOfJSONFormat(
      response.choices[response.choices.length - 1].message.content as string
    )
  ) {
    // if invalid continue chat and require to fix the structure
    response = await openai.chat.completions.create({
      model: structurizerModelSystemCard.modelName,
      temperature: structurizerModelSystemCard.temperature,
      messages: [
        ...response.choices.map((c: ChatCompletion.Choice) => c.message),
        {
          role: 'user',
          content:
            'Please fix the structure of the document and return the structurized version of the document in JSON format.',
        },
      ],
    });

    console.log(
      'is JSON:',
      validateStringIsOfJSONFormat(
        response.choices[response.choices.length - 1].message.content
      ),
      '\nStructurizing:',
      response.choices[response.choices.length - 1].message.content
    );
  }

  return JSON.parse(
    trimJSONOut(
      response.choices[response.choices.length - 1].message.content as string
    )
  );
};

const validateStringIsOfJSONFormat = (str: string | null) => {
  try {
    if (!str) return false;
    JSON.parse(trimJSONOut(str));
    return true;
  } catch (e) {
    return false;
  }
};

const trimJSONOut = (str: string) => {
  const startIndex = str.indexOf('{');
  const endIndex = str.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    // Return an error message or handle the case where no valid JSON is found
    return 'No valid JSON found in the string';
  }

  return str.substring(startIndex, endIndex + 1);
};
