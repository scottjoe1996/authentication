import http from 'http';
import express from 'express';

import config from './config/config';
import logging from './config/logging';
import authorisationRoutes from './routes/authentication';

const NAMESPACE = 'Server';
const server = express();

server.use((request, response, next) => {
  logging.info(NAMESPACE, `METHOD - [${request.method}], URL - [${request.url}], IP - [${request.socket.remoteAddress}]`);

  response.on('finish', () => {
    logging.info(NAMESPACE, `METHOD - [${request.method}], URL - [${request.url}], IP - [${request.socket.remoteAddress}], STATUS - [${response.statusCode}]`);
  });

  next();
});

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use((request, response, next) => {
  //REMOVE ONCE LIVE, USE PREDEFINED ROUTES
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  next();
});

server.use('/authentication', authorisationRoutes);

server.use((request, response) => {
  const error = new Error('Endpoint does not exist');

  return response.status(404).json({
    message: error.message
  });
});

const app = http.createServer(server);
app.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));

export default app;
