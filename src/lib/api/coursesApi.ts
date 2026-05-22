import axiosInstance from 'src/config/axios.config.ts';
import {
  type IPagination,
  type ICourseItem,
  type IPageResponse
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const coursesApi = {
  getCourses: (params: IPagination) => axiosInstance.get<IPageResponse<ICourseItem>>(API_URL.GET_COURSES_LIST, { params })
};
