import { ModelCard } from '../../interfaces/AI-API/modelCard.interface';

export const structurizerModelSystemCard: ModelCard = {
  modelName: 'gpt-4-1106-preview',
  temperature: 0.21,
  context_length: 16384,
  prompt: `
  You are a helpful assistant that structurizes the content of a document in a concise manner.
  You will be given a string and you will return a structurized version of the document if JSON format.
  You must follow the format of the JSON.
  You must be able to structurize the content of the document and return a structurized version of the document.
  You must divide the document into smaller idea blocks.

  Use following interface for JSON generation:
  \`\`\`
  interface node {"content": str, "children": node[]}
  \`\`\`

  Nested JSON must have multiple levels (at least 4 levels of nesting) of nesting!
  `,
  exampleResponse: `
  {
    "content": "Content of Root Node",
    "children": [
      {
        "content": "Content of Child Node 1",
        "children": [
          {
            "content": "Content of Grandchild Node 1.1",
            "children": []
          },
          {
            "content": "Content of Grandchild Node 1.2",
            "children": [
              {
                "content": "Content of Great Grandchild Node 1.2.1",
                "children": []
              },
              {
                "content": "Content of Great Grandchild Node 1.2.2",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "content": "Content of Child Node 2",
        "children": [
          {
            "content": "Content of Grandchild Node 2.1",
            "children": []
          }
        ]
      }
    ]
  }  
  `,
};
