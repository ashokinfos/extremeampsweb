import ApiService from '@/shared/services/apiService';

import type { IAppInfo } from '../types/appInfoTypes';

export const appInfoService = {
  getAppInfo: (): Promise<IAppInfo> => ApiService.get('/client/app-info'),
};
