import ApiService from '@/shared/services/apiService';

import type {
  ICity,
  IState,
  PincodeValidationRequest,
  PincodeValidationResponse,
} from '../types/locationTypes';

export const locationService = {
  getStates: (): Promise<IState[]> => ApiService.get('/location/states'),
  getCities: (stateId: number): Promise<ICity[]> => ApiService.get(`/location/cities/${stateId}`),
  validatePincode: (pincode: string): Promise<PincodeValidationResponse> => {
    const request: PincodeValidationRequest = { PinCode: pincode };
    return ApiService.post('/Address/validate-pincode', request);
  },
};
