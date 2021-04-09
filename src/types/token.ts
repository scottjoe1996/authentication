export type TokenResultStatus = 'NEW_PASSWORD_REQUIRED' | 'AUTHENTICATED';

export interface BaseTokenResult<T extends TokenResultStatus> {
  status: T;
}

export interface NewPassWordRequiredTokenResult extends BaseTokenResult<'NEW_PASSWORD_REQUIRED'> {}

export interface AuthenticatedTokenResult extends BaseTokenResult<'AUTHENTICATED'> {
  token: string;
}

export type TokenResult = NewPassWordRequiredTokenResult | AuthenticatedTokenResult;
