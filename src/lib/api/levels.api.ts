import axiosInstance from 'src/config/axios.config.ts';
import type { ILevel } from '@/types/types';

export const levelsApi = {
  /** GET /levels?categoryId={id} — fetch levels belonging to a specific category */
  getByCategory: (categoryId: number) =>
    axiosInstance.get<ILevel[]>('/levels', { params: { categoryId } })
};
