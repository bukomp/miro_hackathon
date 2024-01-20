import axios from 'axios';
import express from 'express';
import { getEnvOrDefault, getEnvOrThrow } from './utils/config';
import uploadFileRoutes from './routes/uploadFileRoutes';

const app = express();

app.use('/api', uploadFileRoutes);

app.get('/', async (req, res) => {
  const data = await axios.get('https://miro.com/signup/');

  res.send(data.data);
});

app.listen(+getEnvOrDefault('PORT', '3000'), () =>
  console.log(
    `Listening on localhost, port ${+getEnvOrDefault('PORT', '3000')}`
  )
);
