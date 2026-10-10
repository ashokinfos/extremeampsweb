import type { IApiResponse } from '@/shared/types/CommonTypes';

import ApiService from '@/shared/services/apiService';

import type { ICart, IAddToCartDto, IGuestCartItem } from '../types/cartTypes';

export const cartService = {
  getCart: (): Promise<ICart> => ApiService.get('/cart'),

  addToCart: (dto: IAddToCartDto): Promise<IApiResponse> => ApiService.post('/cart', dto),

  updateCartItem: (cartItemId: string, quantity: number): Promise<IApiResponse> =>
    ApiService.patch(`/cart/${cartItemId}`, { Quantity: quantity }),

  removeCartItem: (cartItemId: string): Promise<IApiResponse> =>
    ApiService.delete(`/cart/${cartItemId}`),

  clearCart: (): Promise<IApiResponse> => ApiService.delete('/cart'),

  mergeGuestCart: (items: IGuestCartItem[]): Promise<ICart> =>
    ApiService.post('/cart/merge', {
      Items: items.map((i) => ({
        ProductId: i.ProductId,
        VariantId: i.VariantId,
        Quantity: i.Quantity,
      })),
    }),
};
