import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import config from './config/config';
import logging from './config/logging';
import authorisationRoutes from './routes/authorisation';

const NAMESPACE = 'Server';
const router = express();

router.use((request, response, next) => {
  logging.info(NAMESPACE, `METHOD - [${request.method}], URL - [${request.url}], IP - [${request.socket.remoteAddress}]`);

  response.on('finish', () => {
    logging.info(NAMESPACE, `METHOD - [${request.method}], URL - [${request.url}], IP - [${request.socket.remoteAddress}], STATUS - [${response.statusCode}]`);
  });

  next();
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((request, response, next) => {
  //REMOVE ONCE LIVE, USE PREDEFINED ROUTES
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  next();
});

router.use('/authorisation', authorisationRoutes);

router.use((request, response) => {
  const error = new Error('Route not found');

  return response.status(404).json({
    message: error.message
  });
});

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
