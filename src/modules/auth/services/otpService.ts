import type { IApiResponse } from '@/shared/types/CommonTypes';
import type { IOtpRequest, IValidateOtpRequest } from '@/modules/auth/types/otpTypes';

import ApiService from '@/shared/services/apiService';

export const sendOtp = async (otpRequest: IOtpRequest) => {
  const response = await ApiService.post<IApiResponse>('Otp/generate', otpRequest);
  return response;
};

export const verifyOtp = async (otpRequest: IValidateOtpRequest) => {
  const response = await ApiService.post<IApiResponse>('Otp/validate', otpRequest);
  return response;
};
