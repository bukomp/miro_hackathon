import { MiroApi, Board } from "@mirohq/miro-api";
import { getEnvOrDefault, getEnvOrThrow } from "./../../src/utils/config";
import { getApi } from "./miroApi";
import {
  StickyNoteCreateRequest,
  StickyNoteData,
  PositionChange,
  FixedRatioNoRotationGeometry
} from "@mirohq/miro-api/dist/api";

const requestUrl = `https://api.miro.com/v2/boards/${getEnvOrThrow(
  "MIRO_BOARD_ID"
)}`;

export const mindMap = async (accessToken: string) => {
  //const api = getApi(getEnvOrDefault("MIRO_USER_ID", ""), code);
  const api = new MiroApi(accessToken);
  api
    .getAllBoards()
    .next()
    .then(res => {
      if (res.value) {
        createStickyNote(api, res.value);
      }
      console.log(res);
    });
};

const createStickyNote = (api: MiroApi, board: Board) => {
  console.log("ASDADSASD");
  try {
    board
      .createStickyNoteItem({
        data: {
          content: "ayy lmao",
          shape: "square"
        },
        position: {
          x: 0,
          y: 0
        },
        geometry: {
          height: 420,
          width: 420
        },
        style: {
          fillColor: "green"
        }
      })
      .then(res => {
        //console.log(res);
      });
  } catch (error) {
    console.error(error);
  }
};
