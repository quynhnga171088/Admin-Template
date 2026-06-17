import axiosInstance from 'src/config/axios.config.ts';
import type {
  IUser,
  IPagination,
  IPageResponse
} from '@/types/types';
import { API_URL } from '@/config/constant';

export const usersApi = {
  getUsers: (params: IPagination) => axiosInstance.get<IPageResponse<IUser>>(API_URL.ADMIN_GET_USERS, { params })
};
