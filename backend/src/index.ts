import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/main.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from '@utils/logger.js';
import { createServer } from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export const server = createServer(app);

server.listen(port, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${port}`);
});

export default app;