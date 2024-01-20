import { createMindMapNode } from "./miro/mindMapper2";
import { mindMap } from "./miro/mindMapper";
import axios from "axios";
import express from "express";
import { getEnvOrDefault, getEnvOrThrow } from "./utils/config";
import { grabToken } from "./miro/getToken";

const app = express();

app.get("/", async (req, res) => {
  //await grabToken(req, res);
  const token = getEnvOrDefault("TEMPTOKEN", "");

  if (token != "") {
    await createMindMapNode(token);
    res.send(201);
  } else {
    console.log(await grabToken(req, res));
  }
});

app.get("/auth/miro/callback", async (req, res) => {
  console.log(req.query.code);
  const token = getEnvOrDefault("TEMPTOKEN", "");
  console.log("token", token);

  if (token != "") {
    await createMindMapNode(token);
  } else {
    const accessToken = await grabToken(req, res);
  }
  //await mindMap(accessToken);

  //res.send(200);
});

app.listen(+getEnvOrDefault("PORT", "3000"), () =>
  console.log(
    `Listening on localhost, port ${+getEnvOrDefault("PORT", "3000")}`
  )
);
