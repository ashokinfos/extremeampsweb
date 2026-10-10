export interface IApiToken {
  IsSucceed: boolean;
  ExpiredTime: string;
  AccessToken: string;
  RefreshToken: string;
  Message: string;
}

export interface IApiResponse {
  Status: boolean;
  Message: string;
}
