import { MindMapNode } from "../utils/node";

const sdk = require("api")("@miro-ea/v2.0#a81qse1nlraisyc5");

/**
 *
 * @param accessToken
 * @param boardId
 * @param startItem
 * @param endItem
 * @param xPos
 * @param yPos
 */
export const createConnector = async (
  accessToken: string,
  boardId: string,
  startItem?: string,
  endItem?: string,
  xPos: number = 0,
  yPos: number = 0
) => {
  sdk.auth(accessToken);
  let data: any[] = [];
  data = getNodeOptions(boardId, startItem, endItem, xPos, yPos);

  //console.log("DATA", data);

  const connector = await sdk
    .createConnector(data[0], data[1])
    .then((res: any) => {
      return res.data;
    })
    .catch((err: Error) => console.error(err));
  return connector;
};

const getNodeOptions = (
  boardId: string,
  startItem?: string,
  endItem?: string,
  xPos?: number,
  yPos?: number
) => {
  return [
    {
      startItem: {
        id: startItem,
        snapTo: "auto"
      },
      endItem: {
        id: endItem,
        snapTo: "auto"
      }
    },
    { board_id: boardId }
  ];
};

export const createConnectors = async (
  data: NodePair[],
  accessToken: string,
  boardId: string
) => {
  const connectors: any[] = [];
  data.forEach(async pair => {
    const newConnector = await createConnector(
      accessToken,
      boardId,
      pair.startId,
      pair.endId
    );
    connectors.push(newConnector);
  });

  return connectors;
};

interface NodePair {
  startId?: string;
  endId?: string;
}

export const createIdPairs = (nodes: MindMapNode[]): NodePair[] => {
  const pairs: NodePair[] = [];

  const addPairsFromNode = (node: MindMapNode) => {
    node.children.forEach(child => {
      pairs.push({ startId: node.id, endId: child.id });
      addPairsFromNode(child); // Recursively add pairs for children
    });
  };

  addPairsFromNode(nodes[0]); // Start from the root node
  return pairs;
};
