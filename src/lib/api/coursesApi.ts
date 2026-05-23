import axiosInstance from 'src/config/axios.config.ts';
import {
  type IPagination,
  type ICourseItem,
  type IPageResponse,
  type ICourseCreateRequest
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const coursesApi = {
  getCourses: (params: IPagination) => axiosInstance.get<IPageResponse<ICourseItem>>(API_URL.GET_COURSES_LIST, { params }),
  createCourse: (data: ICourseCreateRequest) => axiosInstance.post<ICourseItem>(API_URL.GET_COURSES_LIST, data)
};
