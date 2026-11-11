export interface IShippingAddress {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  Taluk: string;
  City: string;
  State: string;
  PinCode: string;
  AddressTitle: string;
}

export interface IShippingRateRequest {
  PickupPinCode: string;
  DeliveryPinCode: string;
  Weight: number;
  COD: number;
  State: string;
}

export interface IShippingRate {
  CourierName: string;
  CourierCompanyId: number;
  Rate: number;
  EstimatedDays: number;
  IsCODAvailable: boolean;
}

export interface IInitiateCheckout {
  ShippingAddress: IShippingAddress;
  SelectedCourierName: string;
  ShippingCost: number;
  TermsAccepted: boolean;
  TermsVersion: string;
}

export interface IReInitiateCheckout {
  OrderId: string;
}

export interface IStockIssue {
  VariantName: string;
  Available: number;
  Requested: number;
}

export interface IInitiatePaymentResponse {
  Status: boolean;
  Message: string;
  PaymentUrl: string;
  OrderId: string;
  MerchantOrderId: string;
  OutOfStockItems?: IStockIssue[];
}

export interface IPaymentStatusResponse {
  Status: boolean;
  Message: string;
  PaymentState: string;
  OrderId: string;
  OrderCode?: string;
  TrasnactionId?: string;
  Amount: number;
}
