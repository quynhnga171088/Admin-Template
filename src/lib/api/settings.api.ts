import axiosInstance from '@/config/axios.config';
import { API_URL } from '@/config/constant';
import type { ISetting, IBankInfo } from '@/types/types';

export const settingsApi = {
  getAll: () => axiosInstance.get<ISetting[]>(API_URL.GET_SETTINGS),

  update: (key: string, value: string) => axiosInstance.patch<ISetting>(API_URL.UPDATE_SETTINGS(key), { value }),

  getBankInfo: () => axiosInstance.get<IBankInfo>(API_URL.GET_BANK_INFO),

  updateBankInfo: (data: Partial<IBankInfo>) => axiosInstance.put<IBankInfo>(API_URL.UPDATE_BANK_INFO, data)
};
