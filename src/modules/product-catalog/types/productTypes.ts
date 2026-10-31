export interface IProductVariantImage {
  Id: string;
  ImageUrl: string;
  AltText: string;
  Order: number;
  IsPrimary: boolean;
}

export interface IProductDetailVariant {
  Id: string;
  VariantName: string;
  SKU: string;
  Barcode: string;
  SellingPrice: number;
  DiscountedPrice: number;
  CostPrice: number;
  MetrixWeight: number;
  ProductWeight: number;
  StockQuantity: number;
  IsDefault: boolean;
  IsActive: boolean;
  Images: IProductVariantImage[];
}

export interface IProductImage {
  Id: string;
  ImageUrl: string;
  AltText: string;
  Order: number;
  IsPrimary: boolean;
}

export interface IProductDescription {
  Id: string;
  Title: string;
  Content: string;
  ImageUrl: string;
  Order: number;
}

export interface IProductFeature {
  Id: string;
  ItemType: string;
  ItemValue: string;
  Order: number;
}

export interface IProductDetail {
  Id: string;
  ProductCode: string;
  Name: string;
  Description: string;
  Location: string;
  HSNCode: string;
  TaxRate: number;
  CategoryId: string;
  CategoryName: string;
  IsActive: boolean;
  IsPublished: boolean;
  SelectedVariantId: string;
  Images: IProductImage[];
  Variants: IProductDetailVariant[];
  Descriptions: IProductDescription[];
  Features: IProductFeature[];
}

export interface ICatalogVariant {
  Id: string;
  VariantName: string;
  SKU: string;
  SellingPrice: number;
  DiscountedPrice: number;
  StockQuantity: number;
  InStock: boolean;
  ImageUrl: string | null;
  ProductId: string;
  ProductCode: string;
  ProductName: string;
  ProductDescription: string;
  CategoryName: string;
  MetrixWeight: number;
  ProductWeight: number;
}

export interface ICatalogPagedResult {
  Items: ICatalogVariant[];
  TotalCount: number;
  Page: number;
  PageSize: number;
}

export interface ICatalogCategory {
  Id: string;
  Name: string;
}

export interface ICatalogFilter {
  Search?: string;
  CategoryIds?: string[];
  MinPrice?: number;
  MaxPrice?: number;
  Page: number;
  PageSize: number;
  SortBy?: string; // 'featured' | 'priceAsc' | 'priceDesc' | 'newest'
}

export interface IBanner {
  Id: string;
  Name: string;
  ImageUrl: string;
  AltText: string;
  Order: number;
  IsActive: boolean;
  ProductUrl?: string;
}
