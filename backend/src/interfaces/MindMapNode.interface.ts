export interface MindMapNode {
  id?: string;
  content: string;
  children: MindMapNode[];
  x?: number;
  y?: number;
}
