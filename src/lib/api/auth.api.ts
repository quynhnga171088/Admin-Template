import axiosInstance from 'src/config/axios.config.ts';
import type {
  IAuthForm,
  IRegisterForm,
  IAuthResponse
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const secureApi = {
  login: (formLogin: IAuthForm) => axiosInstance.post<IAuthResponse>(API_URL.LOGIN, formLogin),

  teachRegister: (registerForm: IRegisterForm) => axiosInstance.post<IAuthResponse>(API_URL.TEACH_REGISTER, registerForm),

  studentRegister: (registerForm: IRegisterForm) => axiosInstance.post<IAuthResponse>(API_URL.STUDENT_REGISTER, registerForm)
};
