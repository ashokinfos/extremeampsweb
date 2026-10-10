'use client';

import type { IApiToken } from '@/shared/types/CommonTypes';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useReducer, createContext } from 'react';

// Define the payload structure of your JWT
export interface MyJwtPayload {
  UserName: string;
  UserId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  ClientId: string | null;
  Roles: string;
  exp: number;
}

export interface AuthContextType {
  user: MyJwtPayload | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const initialState = {
  user: null,
  loading: true,   // start true — we don't know auth state until the useEffect runs
  login: () => false,
  logout: () => {},
};

type Action =
  | { type: 'loading'; payload: boolean }
  | { type: 'login'; payload: MyJwtPayload }
  | { type: 'logout' };

function reducer(state: AuthContextType, action: Action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: action.payload };
    case 'login':
      return { ...state, loadding: false, user: action.payload };
    case 'logout':
      localStorage.removeItem('EcomAccessToken');
      localStorage.removeItem('EcomRefreshToken');
      return { ...initialState, loading: false };
    default:
      throw new Error('Unknown action type');
  }
}

export const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('EcomAccessToken');

    const refreshTokenInfo = async () => {
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
          const decodedUser = jwtDecode<MyJwtPayload>(res.data.AccessToken);
          dispatch({ type: 'login', payload: decodedUser });
        } catch {
          // refresh failed — clear tokens and mark as unauthenticated
          localStorage.removeItem('EcomAccessToken');
          localStorage.removeItem('EcomRefreshToken');
        }
      }
      dispatch({ type: 'loading', payload: false });
    };

    if (token) {
      const decodedUser = jwtDecode<MyJwtPayload>(token);
      const currentTime = Date.now() / 1000;
      if (decodedUser.exp > currentTime) {
        dispatch({ type: 'login', payload: decodedUser });
        dispatch({ type: 'loading', payload: false });
      } else {
        refreshTokenInfo();
      }
    } else {
      // No token — not logged in, done loading
      dispatch({ type: 'loading', payload: false });
    }
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('EcomAccessToken', accessToken);
    localStorage.setItem('EcomRefreshToken', refreshToken);
    const decoded = jwtDecode<MyJwtPayload>(accessToken);
    dispatch({ type: 'login', payload: decoded });
  };

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
