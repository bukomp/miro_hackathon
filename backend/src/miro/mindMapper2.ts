import { MindMapNode } from "../utils/node";

const sdk = require("api")("@miro-ea/v2.0#3on7qglqcdtn73");

/**
 * Creates a mind map node.
 * @param accessToken Access token to miro. Must be created for the app and the app should have rights in the desired board
 * @param nodeText What you want to show in the mind map node
 * @param boardId Id of the board
 * @param parentId Optional id of the parent node
 */
export const createMindMapNode = async (
  accessToken: string,
  nodeText: string,
  boardId: string,
  parentId?: string,
  xPos: number = 0,
  yPos: number = 0
) => {
  sdk.auth(accessToken);
  let data: any[] = [];
  if (!parentId) {
    data = getNodeOptions(nodeText, boardId, xPos, yPos);
  } else if (parentId != null) {
    data = getNodeOptionsWithParent(nodeText, boardId, parentId, xPos, yPos);
  }
  console.log("DATA", data);

  const node = await sdk
    .createMindmapNodesExperimental(data[0], data[1])
    .then((res: any) => {
      return res.data;
    })
    .catch((err: Error) => console.error(err));
  return node;
};

const getNodeOptions = (
  nodeText: string,
  boardId: string,
  xPos: number,
  yPos: number
) => {
  return [
    {
      data: {
        nodeView: {
          data: { type: "text", content: nodeText }
        }
      },
      position: { x: xPos, y: yPos }
    },
    { board_id: boardId }
  ];
};

const getNodeOptionsWithParent = (
  nodeText: string,
  boardId: string,
  parentId: string,
  xPos: number,
  yPos: number
) => {
  return [
    {
      data: {
        nodeView: {
          data: { type: "text", content: nodeText }
        }
      },
      position: { x: xPos, y: yPos },
      parent: { id: parentId }
    },
    { board_id: boardId }
  ];
};

// Constants for layout
const rootX = 1000; // X coordinate of the root node
const rootY = 1000; // Y coordinate of the root node
const spacing = 100; // Spacing between levels

export const processNode = async (
  node: MindMapNode,
  accessToken: string,
  boardId: string,
  angle: number,
  level: number,
  parentId?: string
) => {
  let newNode: MindMapNode;

  // Assign coordinates based on angle and level
  node.x = rootX + level * spacing * Math.cos(angle);
  node.y = rootY + level * spacing * Math.sin(angle);

  if (!parentId) {
    newNode = await createMindMapNode(
      accessToken,
      node.content,
      boardId,
      undefined,
      Math.round(node.x),
      Math.round(node.y)
    );
  } else
    newNode = await createMindMapNode(
      accessToken,
      node.content,
      boardId,
      parentId,
      Math.round(node.x),
      Math.round(node.y)
    );
  node.id = newNode.id;

  // Process children nodes
  const childCount = node.children.length;
  const baseAngle = angle + Math.PI / 4; // Adjust base angle for each level

  for (let i = 0; i < childCount; i++) {
    // Calculate angle for each child
    const childAngle = baseAngle + ((2 * Math.PI) / childCount) * i;
    await processNode(
      node.children[i],
      accessToken,
      boardId,
      childAngle,
      level + 1,
      node.id
    );
  }
};
