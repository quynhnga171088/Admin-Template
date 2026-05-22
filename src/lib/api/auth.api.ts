import axiosInstance from 'src/config/axios.config.ts';
import {
  type IAuthForm,
  type IAuthResponse
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const secureApi = {
  login: (formLogin: IAuthForm) => axiosInstance.post<IAuthResponse>(API_URL.LOGIN, formLogin)
};
