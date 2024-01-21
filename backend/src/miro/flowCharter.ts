import { MindMapNode } from '../interfaces/MindMapNode.interface';

const sdk = require('api')('@miro-ea/v2.0#3on7qglqcdtn73');

/**
 * Creates a mind map node.
 * @param accessToken Access token to miro. Must be created for the app and the app should have rights in the desired board
 * @param nodeText What you want to show in the mind map node
 * @param boardId Id of the board
 * @param parentId Optional id of the parent node
 */
export const createFlowchartNode = async (
  accessToken: string,
  nodeText: string,
  boardId: string,
  borderOpacity: number,
  parentId?: string,
  xPos: number = 0,
  yPos: number = 0
) => {
  sdk.auth(accessToken);
  let data: any[] = [];
  //console.log("borderOpacity: ", borderOpacity);

  const { height, width } = getNodeSizeBasedOnContent(nodeText);
  data = getNodeOptions(
    nodeText,
    boardId,
    xPos,
    yPos,
    borderOpacity,
    height,
    width
  );

  //console.log("DATA", data);

  const node = await sdk
    .createShapeItemFlowchart(data[0], data[1])
    .then((res: any) => {
      return res.data;
    })
    .catch((err: Error) => console.error(err));
  return node;
};

interface NodeSize {
  height: number;
  width: number;
}

const getNodeSizeBasedOnContent = (content: string) => {
  let size: NodeSize = {
    height: Math.max(content.length * 1.2, 50),
    width: Math.max(content.length * 2.4, 100),
  };

  // special case for small nodes
  if (content.length < 50) {
    size = {
      height: 70,
      width: 100,
    };
  }

  // special case for small nodes
  if (content.length < 20) {
    size = {
      height: 50,
      width: 100,
    };
  }

  return size;
};

const getNodeOptions = (
  nodeText: string,
  boardId: string,
  xPos: number,
  yPos: number,
  borderOpacity: number,
  height: number,
  width: number
) => {
  return [
    {
      data: {
        content: nodeText,
        shape: 'round_rectangle',
      },
      style: {
        borderOpacity: borderOpacity,
        borderColor: '#1a1a1a',
        textAlign: 'center',
        textAlignVertical: 'middle',
      },
      position: { x: xPos, y: yPos },
      geometry: { height: height, width: width },
    },
    { board_id: boardId },
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
        content: nodeText,
        shape: 'round_rectangle',
      },
      position: { x: xPos, y: yPos },
      parent: { id: parentId },
    },
    { board_id: boardId },
  ];
};

// Constants for layout
const rootX = -5000; // X coordinate of the root node
const rootY = -5000; // Y coordinate of the root node
const spacing = 600; // Spacing between levels

export const processFlowchartNode = async (
  node: MindMapNode,
  accessToken: string,
  boardId: string,
  angle: number,
  level: number,
  parentId?: string,
  parentX?: number,
  parentY?: number
) => {
  let newNode: MindMapNode;

  const { height, width } = getNodeSizeBasedOnContent(node.content);
  // Assign coordinates based on angle and level
  if (parentX && parentY) {
    node.x = parentX + level * spacing * Math.cos(angle);
    node.y = parentY + level * spacing * Math.sin(angle) * 0.7;
  } else {
    node.x = rootX + level * spacing * Math.cos(angle);
    node.y = rootY + level * spacing * Math.sin(angle);
  }

  // call api; for root node set opacity to 1, others 0
  if (!parentId) {
    newNode = await createFlowchartNode(
      accessToken,
      node.content,
      boardId,
      1,
      undefined,
      Math.round(node.x),
      Math.round(node.y)
    );
  } else {
    newNode = await createFlowchartNode(
      accessToken,
      node.content,
      boardId,
      0,
      undefined,
      Math.round(node.x),
      Math.round(node.y)
    );
  }

  node.id = newNode.id;

  // Process children nodes
  const childCount = node.children.length;
  const baseAngle = angle + Math.PI / 4; // Adjust base angle for each level

  await Promise.all(
    node.children.map((childNode, i) => {
      // Calculate angle for each child
      let childAngle: number;
      if (!parentId) {
        childAngle = baseAngle + ((2 * Math.PI) / childCount) * i;
      } else childAngle = baseAngle + (4 / Math.PI / childCount) * i;

      return processFlowchartNode(
        childNode,
        accessToken,
        boardId,
        childAngle,
        level + 1,
        node.id,
        node.x,
        node.y
      );
    })
  );

  return node;
};

// Function to initiate the process and accumulate nodes
export const processAndAccumulateNodes = async (
  rootNode: MindMapNode,
  accessToken: string,
  boardId: string
): Promise<MindMapNode[]> => {
  const nodes: MindMapNode[] = [];
  const stack: MindMapNode[] = [
    await processFlowchartNode(rootNode, accessToken, boardId, 0, 0),
  ];

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (currentNode) {
      nodes.push(currentNode);
      stack.push(...currentNode.children);
    }
  }

  return nodes;
};
