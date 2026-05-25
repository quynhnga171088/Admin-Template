import axiosInstance from 'src/config/axios.config.ts';
import {
  type IPagination,
  type ICourseItem,
  type IPageResponse,
  type IUploadResponse,
  type ICourseCreateRequest
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const coursesApi = {
  getCourses: (params: IPagination) => axiosInstance.get<IPageResponse<ICourseItem>>(API_URL.GET_COURSES_LIST_OR_CREATE, { params }),

  uploadImg: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post<IUploadResponse>(API_URL.UPLOAD_IMAGE, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  createCourse: (data: ICourseCreateRequest) => axiosInstance.post<ICourseItem>(API_URL.GET_COURSES_LIST_OR_CREATE, data)
};
