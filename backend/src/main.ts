import axios from "axios";
import express from "express";
import { getEnvOrDefault, getEnvOrThrow } from "./utils/config";
import uploadFileRoutes from "./routes/uploadFileRoutes";
import cors from "cors";
import { createConnectors, createIdPairs } from "./miro/connectors";
import { mockData } from "./utils/mockData";
import { createMindMapNode, processNode } from "./miro/mindMapper2";
import { grabToken } from "./miro/getToken";
import {
  processFlowchartNode,
  processAndAccumulateNodes
} from "./miro/flowCharter";

const app = express();

const corsOptions = {
  origin: "http://localhost:3001", // Allow only your front-end origin
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use("/api", uploadFileRoutes);

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

app.get("/tree", async (req, res) => {
  //await grabToken(req, res);
  const token = getEnvOrDefault("TEMPTOKEN", "");

  if (token != "") {
    const data = mockData;
    const response = processNode(
      data,
      token,
      getEnvOrThrow("MIRO_BOARD_ID"),
      0,
      0,
      data.id
    );

    res.sendStatus(201);
  } else {
    await grabToken(req, res);
  }
});

app.get("/flow", async (req, res) => {
  //await grabToken(req, res);
  const token = getEnvOrDefault("TEMPTOKEN", "");

  if (token != "") {
    const data = mockData;
    const response = processAndAccumulateNodes(
      data,
      token,
      getEnvOrThrow("MIRO_BOARD_ID")
    ).then(nodes => {
      const idPairs = createIdPairs(nodes);
      createConnectors(idPairs, token, getEnvOrThrow("MIRO_BOARD_ID"));
    });

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
