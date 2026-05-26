import axiosInstance from 'src/config/axios.config.ts';
import type { IUploadResponse } from '@/types/types.ts';
import { API_URL } from '@/config/constant.ts';

export const resourceApi = {
  uploadImg: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post<IUploadResponse>(API_URL.UPLOAD_IMAGE, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadVideo: (
    file: File,
    courseId: number,
    onProgress?: (pct: number) => void
  ) => {
    const form = new FormData();
    form.append('file', file);
    form.append('courseId', String(courseId));
    return axiosInstance.post<IUploadResponse>(API_URL.UPLOAD_VIDEO, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) {
          onProgress(Math.round((100 * e.loaded) / e.total));
        }
      }
    });
  }
};
