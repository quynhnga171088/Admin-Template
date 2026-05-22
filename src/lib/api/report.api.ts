
import {
  type ICourseReport,
  type IStudentReport,
  type IOverviewReport
} from '@/types/types';
import { axiosInstance } from '@/config/axios.config';
import { API_URL } from '@/config/constant';

export const reportApi = {
  getOverview: () => axiosInstance.get<IOverviewReport>(API_URL.ADMIN_REPORT_OVERVIEW),

  getCourseReport: (courseId: number) => axiosInstance.get<ICourseReport>(`${API_URL.ADMIN_REPORT_COURSES}${courseId}`),

  getStudentReport: (studentId: number) => axiosInstance.get<IStudentReport>(`${API_URL.ADMIN_REPORT_STUDENT}${studentId}`)
};
