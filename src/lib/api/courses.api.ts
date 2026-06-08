import axiosInstance from 'src/config/axios.config.ts';
import type {
  IPagination,
  ICourseItem,
  ICourseDetail,
  IPageResponse,
  ICourseCreateRequest,
  ICourseUpdateRequest
} from '@/types/types';
import { API_URL } from '@/config/constant';

export const coursesApi = {
  getCourses: (params: IPagination) => axiosInstance.get<IPageResponse<ICourseItem>>(API_URL.GET_COURSES_LIST, { params }),

  detail: (id: number) => axiosInstance.get<ICourseDetail>(`${API_URL.GET_COURSE_DETAIL}/${id}`),

  createCourse: (data: ICourseCreateRequest) => axiosInstance.post<ICourseItem>(API_URL.CREATE_COURSE, data),

  updateCourse: (id: number, data: ICourseUpdateRequest) => axiosInstance.patch<ICourseItem>(`${API_URL.UPDATE_COURSE}/${id}`, data),

  delete: (id: number) => axiosInstance.delete(API_URL.DELETE_COURSE(id))
};
