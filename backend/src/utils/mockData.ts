import { MindMapNode } from "../interfaces/MindMapNode.interface";

export const mockData: MindMapNode = {
  content: "Root Node Root Node node",
  children: [
    {
      content: "Child Node 1",
      children: [
        {
          content: "Grandchild Node 1",
          children: [] // This node has no children
        },
        {
          content: "Grandchild Node 2",
          children: [] // This node has no children
        }
      ]
    },
    {
      content: "Child Node 2",
      children: [
        {
          content: "Grandchild Node 3",
          children: [
            {
              content:
                "Great-Grandchild Node 1Great-Grandchild Node 1Great-Grandchild Node 1Great-Grandchild Node 1Great-Grandchild Node 1",
              children: [] // This node has no children
            }
          ]
        }
      ]
    }
  ]
};
