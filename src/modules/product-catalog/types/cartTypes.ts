export interface ICartItem {
  Id: string;
  ProductId: string;
  ProductName: string;
  ProductCode: string;
  VariantId: string;
  VariantName: string;
  SKU: string;
  Quantity: number;
  SellingPrice: number;
  DiscountedPrice: number;
  EffectivePrice: number;
  ItemTotal: number;
  ImageUrl: string | null;
  StockQuantity: number;
  MetrixWeight: number;
  ProductWeight: number;
}

export interface ICart {
  CartId: string;
  Items: ICartItem[];
  SubTotal: number;
  TotalItems: number;
  PendingOrderId?: string;
}

export interface IAddToCartDto {
  ProductId: string;
  VariantId: string;
  Quantity: number;
}

export interface IGuestCartItem {
  ProductId: string;
  VariantId: string;
  Quantity: number;
  // local-only display fields
  ProductName?: string;
  VariantName?: string;
  EffectivePrice?: number;
  ImageUrl?: string | null;
  StockQuantity?: number;
}
