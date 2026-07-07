import axiosInstance from 'src/config/axios.config';
import type {
  ICategory,
  ICategoryCreateRequest
} from '@/types/types';
import { API_URL } from '@/config/constant';

export type ICategoryUpdateRequest = Partial<ICategoryCreateRequest>;

export const categoriesApi = {
  getAll: () => axiosInstance.get<ICategory[]>(API_URL.GET_CATEGORIES),

  getById: (id: number) => axiosInstance.get<ICategory>(API_URL.GET_CATEGORY(id)),

  create: (data: ICategoryCreateRequest) => axiosInstance.post<ICategory>(API_URL.ADD_CATEGORY, data),

  update: (id: number, data: ICategoryUpdateRequest) => axiosInstance.put<ICategory>(API_URL.UPDATE_CATEGORY(id), data),

  remove: (id: number) => axiosInstance.delete(API_URL.REMOVE_CATEGORY(id))
};
