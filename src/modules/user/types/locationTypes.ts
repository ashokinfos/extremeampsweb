export interface IState {
  Id: number;
  Name: string;
}

export interface ICity {
  Id: number;
  Name: string;
  StateId: number;
}

export interface PincodeValidationResponse {
  IsValid: boolean;
  Message: string;
  City?: string;
  State?: string;
  District?: string;
  Country?: string;
}

export interface PincodeValidationRequest {
  PinCode: string;
}
