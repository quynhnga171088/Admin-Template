import axiosInstance from 'src/config/axios.config';
import { API_URL } from '@/config/constant';
import type { IPageResponse, IPagination, IRegistrationContent } from '@/types/types';

export const enrollmentApi = {
  getEnrollments: (params: IPagination) => axiosInstance.get<IPageResponse<IRegistrationContent>>(API_URL.GET_ENROLLMENTS, { params }),

  getEnrollmentDetail: (enrollmentId: number) => axiosInstance.get<IRegistrationContent>(API_URL.GET_ENROLLMENT_DETAIL(enrollmentId)),

  approve: (enrollmentId: number) => axiosInstance.patch<IRegistrationContent>(API_URL.APPROVE_ENROLLMENT(enrollmentId)),

  reject: (enrollmentId: number, note: string) => axiosInstance.patch<IRegistrationContent>(`/enrollments/${enrollmentId}/reject`, { note })
};
