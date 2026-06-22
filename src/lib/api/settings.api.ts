import axiosInstance from '@/config/axios.config';
import { API_URL } from '@/config/constant';
import type { ISetting, ISettingUpdateRequest } from '@/types/types';

export const settingsApi = {
  getAll: () => axiosInstance.get<ISetting[]>(API_URL.GET_SETTINGS),
  update: (key: string, data: ISettingUpdateRequest) => axiosInstance.patch<ISetting>(API_URL.UPDATE_SETTING(key), data)
};
