import { ChatCompletionMessageParam } from 'openai/resources';

// divide context to chunks of max 4096 tokens
export const contextDivider = (
  context: string,
  maxTokens: number
): ChatCompletionMessageParam[] => {
  const messages: ChatCompletionMessageParam[] = [];
  let currentMessage = '';
  for (const line of context.split('\n')) {
    if (currentMessage.length + line.length > maxTokens) {
      messages.push({ role: 'user', content: currentMessage });
      currentMessage = '';
    }
    currentMessage += `${line}\n`;
  }
  if (currentMessage) {
    messages.push({ role: 'user', content: currentMessage });
  }

  return messages;
};
