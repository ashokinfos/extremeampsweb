import ApiService from '@/shared/services/apiService';

import type {
  IMyOrderSummary,
  IMyOrderDetails,
  ITrackingDetails,
  ICancelOrderResponse,
} from '../types/orderTypes';

export const myOrderService = {
  getMyOrders: (): Promise<IMyOrderSummary[]> => ApiService.get('/my-orders'),
  getMyOrderDetails: (orderId: string): Promise<IMyOrderDetails> =>
    ApiService.get(`/my-orders/${orderId}`),
  getTrackingDetails: (orderId: string): Promise<ITrackingDetails> =>
    ApiService.get(`/my-orders/${orderId}/tracking`),
  cancelOrder: (orderId: string): Promise<ICancelOrderResponse> =>
    ApiService.post(`/my-orders/${orderId}/cancel`, { CancelledBy: 'User' }),
  downloadInvoice: async (orderId: string, orderCode: string): Promise<void> => {
    const response = await ApiService.getBlob(`/my-orders/${orderId}/invoice`);
    const url = URL.createObjectURL(response);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${orderCode}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
