import { create } from 'axios';

import { API_BASE_URL } from '@/constants/api';
import { tokenService } from '@/services/tokenService';
// variable to store  a function 
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

// Create an Axios instance with default configuration
export const axiosInstance = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenService.getToken();

  console.log("➡️ REQUEST:", {
    url: config.url,
    method: config.method,
    data: config.data,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("⬅️ RESPONSE:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.log("⬅️ ERROR:", {
      status: error?.response?.status,
      data: error?.response?.data,
    });
    if (error?.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
  
);
