import type { IApiResponse } from '@/shared/types/CommonTypes';
import type {
  IUser,
  ICreateUser,
  IUpdateUser,
  IUserProfile,
  IAddressInfo,
  ISaveAddress,
  ISignUpRequest,
  IUpdateProfile,
  IChangePassword,
} from '@/modules/user/types/userTypes';

import ApiService from '@/shared/services/apiService';

export const CreateNewUser = async (userData: ISignUpRequest) => {
  const response = await ApiService.post<IApiResponse>('/Auth/register', userData);
  return response;
};

export const userService = {
  getUsers: (): Promise<IUser[]> => ApiService.get('/user'),
  getUserById: (id: string): Promise<IUser> => ApiService.get(`/user/${id}`),
  createUser: (data: ICreateUser): Promise<IApiResponse> => ApiService.post('/user', data),
  updateUser: (id: string, data: IUpdateUser): Promise<IApiResponse> =>
    ApiService.put(`/user/${id}`, data),
  toggleUserActive: (id: string): Promise<IApiResponse> =>
    ApiService.patch(`/user/${id}/toggle-active`, {}),
  deleteUser: (id: string): Promise<IApiResponse> => ApiService.delete(`/user/${id}`),

  // Profile APIs
  getMyProfile: (): Promise<IUserProfile> => ApiService.get('/user/profile'),
  updateMyProfile: (data: IUpdateProfile): Promise<IApiResponse> =>
    ApiService.put('/user/profile', data),
  changePassword: (data: IChangePassword): Promise<IApiResponse> =>
    ApiService.post('/auth/change-password', data),

  // Address APIs
  getAddresses: (): Promise<IAddressInfo[]> => ApiService.get('/address'),
  createAddress: (data: ISaveAddress): Promise<IApiResponse> => ApiService.post('/address', data),
  updateAddress: (id: string, data: ISaveAddress): Promise<IApiResponse> =>
    ApiService.put(`/address/${id}`, data),
  deleteAddress: (id: string): Promise<IApiResponse> => ApiService.delete(`/address/${id}`),
};
