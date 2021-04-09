import { Request, Response, NextFunction } from 'express';

import logging from '../config/logging';
import { CognitoService } from '../services/authenticator-service';
import { changeAdminSetPasswordRequest, getAuthenticationRequest, IsTokenValidRequest, UserDetails } from '../types';

const NAMESPACE = 'Authentication Controller';

const healthCheck = (request: Request, response: Response): Response => {
  logging.info(NAMESPACE, 'Authentication health check route called.');

  return response.status(200).json({
    message: 'pong'
  });
};

const changeAdminSetPassword = async (request: Request, response: Response): Promise<Response> => {
  const requestBody = request.body as changeAdminSetPasswordRequest;
  const accessTokenHelper = new CognitoService();

  try {
    const tokenResult = await accessTokenHelper.changeAdminSetPassword(requestBody.userDetailsWithOldPassword, requestBody.newPassword);
    response.status(200).json({ jwtToken: tokenResult.token });
  } catch (err) {
    response.status(401).json({ message: `Failed to change admin password for user ${requestBody.userDetailsWithOldPassword.Username}`, error: err });
  }

  return response;
};

const getAuthenticationToken = async (request: Request, response: Response): Promise<Response> => {
  const requestBody = request.body as getAuthenticationRequest;
  const accessTokenHelper = new CognitoService();

  try {
    const tokenResult = await accessTokenHelper.generateToken(requestBody.userDetails);
    if (tokenResult.status === 'AUTHENTICATED') {
      response.status(200).json({ jwtToken: tokenResult.token });
    } else {
      response.status(307).json();
    }
  } catch (err) {
    response.status(401).json({ message: `Failed to authenticate user ${requestBody.userDetails.Username}`, error: err });
  }

  return response;
};

const isTokenValid = async (request: Request, response: Response): Promise<Response> => {
  const requestBody = request.body as IsTokenValidRequest;
  const accessTokenHelper = new CognitoService();
  try {
    await accessTokenHelper.checkIfTokenIsValid(requestBody.token);
    response.status(200).json();
  } catch (err) {
    response.status(401).json({ message: `Token is not valid`, error: err });
  }

  return response;
};

export { healthCheck, getAuthenticationToken, isTokenValid, changeAdminSetPassword };
