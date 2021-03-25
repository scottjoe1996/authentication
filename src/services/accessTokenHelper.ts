import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

import config from '../config/config';
import { TokenResult, UserDetails } from '../types';

export class AccessTokenHelper {
  public async generateToken(userDetails: UserDetails): Promise<TokenResult> {
    const authenticationDetails = new AuthenticationDetails(userDetails);
    const cognitoUser = this.getCognitoUser(userDetails.Username);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({ status: 'AUTHENTICATED', token: result.getAccessToken().getJwtToken() });
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

  public async checkIfTokenIsValid(token: string): Promise<void> {
    const pem = await this.getPem();

    jwt.verify(token, pem);
  }

  private getCognitoUser(username: string): CognitoUser {
    const userPool = new CognitoUserPool(config.userPoolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    return new CognitoUser(userData);
  }

  private async getPem(): Promise<jwt.Secret> {
    const jwkUrl = `https://cognito-idp.${config.awsRegion}.amazonaws.com/${config.userPoolData.UserPoolId}/.well-known/jwks.jso`;

    return axios
      .get(jwkUrl)
      .then((response) => response.data['keys'].shift())
      .then((jwk) => jwkToPem(jwk));
  }
}
