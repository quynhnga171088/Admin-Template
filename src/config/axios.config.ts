import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { authStore } from '@/stores/auth.store.ts';
import {
  TIMEOUT_REQUEST
} from '@/config/constant';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_REQUEST,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = authStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)));
  failedQueue = [];
};

const isAuthPath = (url: string | undefined): boolean => {
  if (!url) return false;
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/me')
  );
};

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: any) => {
    const orig = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthPath(String(orig?.url)) && !orig._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(token => {
            orig.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(orig);
          })
          .catch(err => Promise.reject(err));
      }
      orig._retry = true;
      isRefreshing = true;
      const { refreshToken, logout } = authStore.getState();
      if (!refreshToken) {
        logout(); return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newAt, refreshToken: newRt, user } = data;
        authStore.getState().setAuth(user, newAt, newRt);
        processQueue(null, newAt);
        orig.headers.Authorization = `Bearer ${newAt}`;
        return axiosInstance(orig);
      } catch (err) {
        processQueue(err, null); logout(); return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
