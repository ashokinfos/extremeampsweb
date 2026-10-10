export interface ISignUpRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  Otp: string;
}

export interface IUser {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  IsActive: boolean;
  ClientId: string | null;
  ClientName?: string;
  Roles: string[];
}

export interface IUserProfile {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
}

export interface IUpdateProfile {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
}

export interface IChangePassword {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface IAddressInfo {
  Id: string;
  AddressTitle: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  Taluk: string;
  City: string;
  State: string;
  PinCode: string;
}

export interface ISaveAddress {
  AddressTitle: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  Taluk: string;
  City: string;
  State: string;
  PinCode: string;
}

export interface ICreateUser {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  ClientId: string | null;
  Password: string;
  Roles: string[];
}

export interface IUpdateUser {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  ClientId: string | null;
  Roles: string[];
}
