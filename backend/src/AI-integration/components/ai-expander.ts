import { ChatCompletionMessageParam } from 'openai/resources';
import { contextDivider } from '../../utils/contextDivider';
import { openai } from '../ai-main';
import { expanderModelSystemCard } from '../basePrompts/response_expander';
import { MindMapNode } from '../../interfaces/MindMapNode.interface';

export const expandContentWithAI = async (
  fileContents: string,
  mindMapData: MindMapNode
) => {
  return await iterateThroughNodes(
    mindMapData,
    fileContents,
    mindMapData.content
  );
};

const iterateThroughNodes = async (
  node: MindMapNode,
  fileContents: string,
  previousContent: string
) => {
  for (let i = 0; i < node.children.length; i++) {
    console.log('\n --- Original content:::', node.children[i].content);
    node.children[i].content = await expandContent(
      fileContents,
      node.content,
      previousContent
    );
    console.log(' +++ Expanded content:::', node.children[i].content);

    node.children[i] = await iterateThroughNodes(
      node.children[i],
      fileContents,
      node.children[i].content
    );
  }

  return node;
};

const expandContent = async (
  fileContents: string,
  content: string,
  previousContent: string
): Promise<string> => {
  const messages: ChatCompletionMessageParam[] = [
    ...contextDivider(fileContents, expanderModelSystemCard.context_length),
    { role: 'system', content: expanderModelSystemCard.prompt },
    {
      role: 'system',
      content: `
        DO NOT REPEAT PREVIOUS CONTENT!
        Previous content: 
        "${previousContent}"
      `,
    },
    {
      role: 'user',
      content: 'Content to expand:' + content,
    },
    {
      role: 'user',
      content: 'Now expand given text based on context and given instructions.',
    },
  ];

  const response = await openai.chat.completions.create({
    model: expanderModelSystemCard.modelName,
    temperature: expanderModelSystemCard.temperature,
    max_tokens: expanderModelSystemCard.max_response_tokens,
    messages,
  });

  const responseString: string = response.choices[response.choices.length - 1]
    .message.content as string;

  return responseString;
};
