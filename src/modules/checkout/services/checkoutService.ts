import ApiService from '@/shared/services/apiService';

import type {
  IShippingRate,
  IInitiateCheckout,
  IReInitiateCheckout,
  IShippingRateRequest,
  IPaymentStatusResponse,
  IInitiatePaymentResponse,
} from '../types/checkoutTypes';

export const checkoutService = {
  getShippingRates: (dto: IShippingRateRequest): Promise<IShippingRate[]> =>
    ApiService.post('/checkout/shipping-rates', dto),

  initiateCheckout: (dto: IInitiateCheckout): Promise<IInitiatePaymentResponse> =>
    ApiService.post('/checkout/initiate', dto),

  reInitiateCheckout: (dto: IReInitiateCheckout): Promise<IInitiatePaymentResponse> =>
    ApiService.post('/checkout/re-initiate', dto),

  getPaymentStatus: (merchantOrderId: string): Promise<IPaymentStatusResponse> =>
    ApiService.get(`/checkout/payment-callback/${merchantOrderId}`),
};
