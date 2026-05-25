import axiosInstance from 'src/config/axios.config.ts';
import type {
  IPagination,
  ICourseItem,
  ICourseDetail,
  IPageResponse,
  IUploadResponse,
  ICourseCreateRequest,
  ICourseUpdateRequest
} from '@/types/types';
import { API_URL } from '@/config/constant.ts';

export const coursesApi = {
  getCourses: (params: IPagination) => axiosInstance.get<IPageResponse<ICourseItem>>(API_URL.GET_COURSES_LIST, { params }),

  uploadImg: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post<IUploadResponse>(API_URL.UPLOAD_IMAGE, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  detail: (id: number) => axiosInstance.get<ICourseDetail>(`${API_URL.GET_COURSE_DETAIL}/${id}`),

  createCourse: (data: ICourseCreateRequest) => axiosInstance.post<ICourseItem>(API_URL.CREATE_COURSE, data),

  updateCourse: (id: number, data: ICourseUpdateRequest) => axiosInstance.patch<ICourseItem>(`${API_URL.UPDATE_COURSE}/${id}`, data)
};
