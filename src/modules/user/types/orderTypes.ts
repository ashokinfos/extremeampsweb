export interface IMyOrderSummary {
  OrderId: string;
  OrderCode: string;
  Status: string;
  StatusId: string;
  OrderDate: string;
  CustomerName: string;
  CourierInfo: string;
  ShippedDate: string | null;
  DeliveredDate: string | null;
  Total: number;
}

export interface IOrderItem {
  Id: string;
  ProductId: string;
  ProductName: string;
  VariantName: string;
  Quantity: number;
  Price: number;
  ItemTotal: number;
  ImageUrl: string | null;
}

export interface IOrderInfo {
  OrderId: string;
  OrderCode: string;
  OrderDate: string;
  Status: string;
  SubTotal: number;
  ShippingCost: number;
  Total: number;
  CourierName: string;
  TrackingNumber: string | null;
  ShippedDate: string | null;
  DeliveredDate: string | null;
}

export interface IShippingDetails {
  AddressTitle: string;
  CustomerName: string;
  PhoneNumber: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  State: string;
  PinCode: string;
}

export interface IPaymentInfo {
  PaymentMethod: string;
  PaymentOrderId: string;
  AmountPaid: number;
  PaymentStatus: string;
  PaymentDate: string | null;
}

export interface IMyOrderDetails {
  OrderInfo: IOrderInfo;
  OrderedItems: IOrderItem[];
  ShippingDetails: IShippingDetails;
  PaymentInfo: IPaymentInfo;
}

export interface ICancelOrderResponse {
  Success: boolean;
  Message: string;
}

// ── Tracking ──────────────────────────────────────────────────────────

export interface ITrackingActivity {
  Date: string;
  Activity: string;
  Location: string;
  Status: string;
}

export interface ITrackingDetails {
  TrackingNumber: string;
  CourierName: string;
  ShipmentStatus: string;
  Origin: string;
  Destination: string;
  EstimatedDelivery: string | null;
  PickedUpDate: string | null;
  DeliveredDate: string | null;
  Activities: ITrackingActivity[];
}

