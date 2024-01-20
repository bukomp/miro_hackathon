const sdk = require("api")("@miro-ea/v2.0#3on7qglqcdtn73");

export const createMindMapNode = async (accessToken: string) => {
  sdk.auth(accessToken);
  sdk
    .createMindmapNodesExperimental(
      {
        data: {
          nodeView: {
            data: { type: "text", content: "haista vittu t: kikki hiiri" }
          }
        }
      },
      { board_id: "uXjVN3AP4QI=" }
    )
    .then((res: any) => {
      console.log(res.body);
    })
    .catch((err: Error) => console.error(err));
};
