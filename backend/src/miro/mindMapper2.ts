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
  parentId?: string
) => {
  sdk.auth(accessToken);
  let data: any[] = [];
  if (!parentId) {
    data = getNodeOptions(nodeText, boardId);
  } else if (parentId != null) {
    data = getNodeOptionsWithParent(nodeText, boardId, parentId);
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

const getNodeOptions = (nodeText: string, boardId: string) => {
  return [
    {
      data: {
        nodeView: {
          data: { type: "text", content: nodeText }
        }
      }
    },
    { board_id: boardId }
  ];
};

const getNodeOptionsWithParent = (
  nodeText: string,
  boardId: string,
  parentId: string
) => {
  return [
    {
      data: {
        nodeView: {
          data: { type: "text", content: nodeText }
        }
      },
      parent: { id: parentId }
    },
    { board_id: boardId }
  ];
};
