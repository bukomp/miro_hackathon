import OpenAI from 'openai';
import { AIConfig } from '../utils/config';
import { analyzeWithAI } from './components/ai-analyzer';
import { summarizeWithAI } from './components/ai-summarizer';
import { MindMapNode } from '../interfaces/MindMapNode.interface';
import { structurizeWithAI } from './components/ai-structurizer';
import { expandContentWithAI } from './components/ai-expander';

export const openai = new OpenAI(AIConfig);

export const getAIMindMap = async (
  fileContents: string,
  assistingPrompt: string
): Promise<MindMapNode> => {
  let analyzedData;
  while (!analyzedData) {
    analyzedData = await analyzeWithAI(fileContents, assistingPrompt);
  }

  console.log('\nANALYSIS:', analyzedData);

  let summary;
  while (!summary) {
    summary = await summarizeWithAI(fileContents, analyzedData);
  }

  console.log('\nSUMMARY:', summary);

  const structurizedData: MindMapNode = await structurizeWithAI(
    fileContents,
    analyzedData,
    summary,
    assistingPrompt
  );

  return structurizedData;
};
