import axiosInstance from 'src/config/axios.config';
import { API_URL } from '@/config/constant';
import type { IPageResponse, IPagination, IRegistrationContent } from '@/types/types';

export const enrollmentApi = {
  getEnrollments: (params: IPagination) => axiosInstance.get<IPageResponse<IRegistrationContent>>(API_URL.GET_ENROLLMENTS, { params })
};
