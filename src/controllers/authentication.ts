import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';
import { AccessTokenHelper } from '../services/accessTokenHelper';
import { UserDetails } from '../types';

const NAMESPACE = 'Authentication Controller';

const healthCheck = (request: Request, response: Response): Response => {
  logging.info(NAMESPACE, 'Authentication health check route called.');

  return response.status(200).json({
    message: 'pong'
  });
};

const getAuthenticationToken = async (request: Request, response: Response): Promise<Response> => {
  const userDetails = request.body as UserDetails;
  const accessTokenHelper = new AccessTokenHelper();

  try {
    const tokenResult = await accessTokenHelper.generateToken(userDetails);
    if (tokenResult.status === 'AUTHENTICATED') {
      response.status(200).json({ jwtToken: tokenResult.token });
    } else {
      response.status(307).json();
    }
  } catch (err) {
    response.status(401).json({ message: `Failed to authenticate user ${userDetails.Username}`, error: err });
  }

  return response;
};

const isTokenValid = (request: Request, response: Response): Response => {
  const token = request.body as string;
  const accessTokenHelper = new AccessTokenHelper();

  try {
    accessTokenHelper.checkIfTokenIsValid(token);
    response.status(200);
  } catch (err) {
    response.status(401);
  }

  return response;
};

export { healthCheck, getAuthenticationToken, isTokenValid };
