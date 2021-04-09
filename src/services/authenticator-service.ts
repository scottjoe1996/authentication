import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

import config from '../config/config';
import { AuthenticatedTokenResult, TokenResult, UserDetails } from '../types';

export interface AuthenticatorService {
  changeAdminSetPassword: (userDetailsWithOldPassword: UserDetails, newPassword: string) => Promise<AuthenticatedTokenResult>;
  generateToken: (userDetails: UserDetails) => Promise<TokenResult>;
  checkIfTokenIsValid: (token: string) => Promise<void>;
}

export class CognitoService implements AuthenticatorService {
  public async changeAdminSetPassword(userDetailsWithOldPassword: UserDetails, newPassword: string): Promise<AuthenticatedTokenResult> {
    const authenticationDetails = new AuthenticationDetails(userDetailsWithOldPassword);
    const cognitoUser = this.getCognitoUser(userDetailsWithOldPassword.Username);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: () => {
          reject(new Error('Admin password has already been changed'));
        },
        onFailure: (error) => {
          reject(error);
        },
        newPasswordRequired: () => {
          cognitoUser.completeNewPasswordChallenge(
            newPassword,
            {},
            {
              onSuccess: (session) => {
                resolve({ status: 'AUTHENTICATED', token: session.getIdToken().getJwtToken() });
              },
              onFailure: (error) => {
                reject(error);
              }
            }
          );
        }
      });
    });
  }

  public async generateToken(userDetails: UserDetails): Promise<TokenResult> {
    const authenticationDetails = new AuthenticationDetails(userDetails);
    const cognitoUser = this.getCognitoUser(userDetails.Username);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({ status: 'AUTHENTICATED', token: result.getIdToken().getJwtToken() });
        },
        onFailure: (error) => {
          reject(error);
        },
        newPasswordRequired: () => {
          resolve({ status: 'NEW_PASSWORD_REQUIRED' });
        }
      });
    });
  }

  private getCognitoUser(username: string): CognitoUser {
    const userPool = new CognitoUserPool(config.userPoolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    return new CognitoUser(userData);
  }

  public async checkIfTokenIsValid(token: string): Promise<void> {
    const pem = await this.getPem();

    return new Promise((resolve, reject) => {
      jwt.verify(token, pem, { algorithms: ['RS256'] }, (error, decode) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  private async getPem(): Promise<jwt.Secret> {
    const jwkUrl = `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.userPoolData.UserPoolId}/.well-known/jwks.json`;

    return axios
      .get(jwkUrl)
      .then((response) => {
        return response.data['keys'].shift();
      })
      .then((jwk) => jwkToPem(jwk));
  }
}
