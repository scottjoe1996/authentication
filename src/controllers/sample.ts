import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Sample Controller';

const healthCheck = (request: Request, response: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Sample health check route called.');

  return response.status(200).json({
    message: 'pong'
  });
};

export default { healthCheck };
