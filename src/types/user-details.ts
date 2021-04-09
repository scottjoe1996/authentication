import { IAuthenticationDetailsData } from 'amazon-cognito-identity-js';

export interface UserDetails extends Required<Pick<IAuthenticationDetailsData, 'Username' | 'Password'>> {}
