import { createMindMapNode } from "./miro/mindMapper2";
import axios from "axios";
import express from "express";
import { getEnvOrDefault, getEnvOrThrow } from "./utils/config";
import { grabToken } from "./miro/getToken";

const app = express();

app.get("/", async (req, res) => {
  //await grabToken(req, res);
  const token = getEnvOrDefault("TEMPTOKEN", "");

  if (token != "") {
    const node = await createMindMapNode(
      token,
      "parent test123",
      getEnvOrThrow("MIRO_BOARD_ID"),
      "3458764576268498045"
    );
    console.log(node);

    res.sendStatus(201);
  } else {
    await grabToken(req, res);
  }
});

app.get("/auth/miro/callback", async (req, res) => {
  //await mindMap(accessToken);
  await grabToken(req, res);

  res.sendStatus(200);
});

app.listen(+getEnvOrDefault("PORT", "3000"), () =>
  console.log(
    `Listening on localhost, port ${+getEnvOrDefault("PORT", "3000")}`
  )
);
