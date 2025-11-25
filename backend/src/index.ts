import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes/main.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from '@utils/logger.js';
import { createServer } from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export const server = createServer(app);

server.listen(port, () => {
  logger.info(`Server running on port ${port}.`);
  logger.info(`Allowed origins: ${allowedOrigins.join(', ')}.`);
  logger.info(`URL: http://localhost:${port}`);
});

export default app;