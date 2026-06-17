import axiosInstance from 'src/config/axios.config.ts';
import type {
  IUser,
  INewTeacher,
  IUserDetail,
  IPagination,
  IPageResponse
} from '@/types/types';
import { API_URL } from '@/config/constant';

export const usersApi = {
  getUsers: (params: IPagination) => axiosInstance.get<IPageResponse<IUser>>(API_URL.ADMIN_GET_USERS, { params }),

  getById: (userId: number) => axiosInstance.get<IUserDetail>(API_URL.ADMIN_GET_USER_DETAIL(userId)),

  createNewTeacher: (data: INewTeacher) => axiosInstance.post<IUser>(API_URL.ADMIN_CREATE_USERS, data),

  updateTeacher: (userId: number, data: IUser) => axiosInstance.patch<IUser>(API_URL.ADMIN_UPDATE_USER(userId), data),

  deleteTeacher: (userId: number) => axiosInstance.delete(API_URL.ADMIN_DELETE_USER(userId))
};
