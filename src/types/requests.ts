import { UserDetails } from './user-details';

export interface changeAdminSetPasswordRequest {
  userDetailsWithOldPassword: UserDetails;
  newPassword: string;
}

export interface getAuthenticationRequest {
  userDetails: UserDetails;
}

export interface IsTokenValidRequest {
  token: string;
}
