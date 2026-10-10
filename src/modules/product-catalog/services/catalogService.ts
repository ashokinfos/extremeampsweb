import ApiService from '@/shared/services/apiService';

import type {
  IBanner,
  ICatalogFilter,
  IProductDetail,
  ICatalogCategory,
  ICatalogPagedResult,
} from '../types/productTypes';

export const catalogService = {
  getCategories: (): Promise<ICatalogCategory[]> => ApiService.get('/category'),

  getCatalog: async (filter: ICatalogFilter): Promise<ICatalogPagedResult> =>
    ApiService.post<ICatalogPagedResult>(`/catalog`, filter),

  getProductDetail: (variantId: string): Promise<IProductDetail> =>
    ApiService.get<IProductDetail>(`/product/detail/variant/${variantId}`),

  getBanners: (): Promise<IBanner[]> => ApiService.get('/banner'),
};
