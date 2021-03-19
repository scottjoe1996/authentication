import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

import config from '../config/config';
import { UserDetails } from '../types';

export class AccessTokenHelper {
  public async generateToken(userDetails: UserDetails): Promise<string> {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(userDetails);
    const cognitoUser = this.getCognitoUser();

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result.getAccessToken().getJwtToken());
        },
        onFailure: (error) => {
          reject(error);
        }
      });
    });
  }

  public async checkIfTokenIsValid(token: string): Promise<void> {
    const pem = await this.getPem();

    jwt.verify(token, pem);
  }

  private getCognitoUser(): AmazonCognitoIdentity.CognitoUser {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(config.userPoolData);
    const userData = {
      Username: 'username',
      Pool: userPool
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
  }

  private async getPem(): Promise<jwt.Secret> {
    const jwkUrl = `https://cognito-idp.${config.userPoolData.awsRegion}.amazonaws.com/${config.userPoolData.UserPoolId}/.well-known/jwks.jso`;

    return axios
      .get(jwkUrl)
      .then((response) => response.data['keys'].shift())
      .then((jwk) => jwkToPem(jwk));
  }
}
