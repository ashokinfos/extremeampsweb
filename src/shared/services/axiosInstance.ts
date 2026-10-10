'use client';

import { toast, Bounce } from 'react-toastify';
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { IApiToken } from '../types/CommonTypes';

// Base configuration for Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000', // Set your base URL
  timeout: 60000, // Request timeout in milliseconds
});

export const setupInterceptors = (setLoading: (loading: boolean) => void) => {
  // Clear existing interceptors to avoid duplicates
  axiosInstance.interceptors.request.clear();

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      setLoading(true);
      config.headers = config.headers || {};
      const token = localStorage.getItem('EcomAccessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.Message);
      } else {
        console.log(error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle global errors
  axiosInstance.interceptors.response.use(
    async (response: AxiosResponse) => {
      setLoading(false);
      return response;
    },
    async (error) => {
      setLoading(false);
      const originalRequest = error.config;

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('EcomRefreshToken');

            if (refreshToken) {
              try {
                const res = await axios.post<IApiToken>(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
                  {
                    accessToken: localStorage.getItem('EcomAccessToken'),
                    refreshToken,
                  }
                );
                localStorage.setItem('EcomAccessToken', res.data.AccessToken);
                localStorage.setItem('EcomRefreshToken', res.data.RefreshToken);
                originalRequest.headers.Authorization = `Bearer ${res.data.AccessToken}`;
                return axiosInstance(originalRequest);
              } catch (refreshError) {
                localStorage.clear();
                toast.error('Session expired. Please login again.', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  theme: 'light',
                  transition: Bounce,
                });
                setTimeout(() => {
                  window.location.href = `${''}/sign-in`;
                }, 1000);
                return Promise.reject(refreshError);
              }
            } else {
              localStorage.clear();
              toast.error('Please login to continue.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
                transition: Bounce,
              });
              setTimeout(() => {
                window.location.href = `${''}/sign-in`;
              }, 1000);
              return Promise.reject(error);
            }
          } else if (status === 401) {
            // Already retried, clear and redirect
            localStorage.clear();
            window.location.href = `${''}/sign-in`;
            return Promise.reject(error);
          } else {
            const errorMessage =
              data?.Message || data?.message || `Error ${status}: ${error.message}`;
            toast.error(errorMessage, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: 'light',
              transition: Bounce,
            });
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
            transition: Bounce,
          });
        } else {
          toast.error('Request failed. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
            transition: Bounce,
          });
        }
      } else {
        toast.error('An unexpected error occurred.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          transition: Bounce,
        });
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
