export interface IOtpRequest {
  Identifier: string;
  IdentifierType: string;
  IsRegister: boolean;
  IsLogin: boolean;
}

export interface IValidateOtpRequest {
  Identifier: string;
  IdentifierType: string;
  Otp: string;
}
