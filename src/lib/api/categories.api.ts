import axiosInstance from 'src/config/axios.config.ts';
import type { ICategory } from '@/types/types';

export const categoriesApi = {
  getAll: () => axiosInstance.get<ICategory[]>('/categories')
};
