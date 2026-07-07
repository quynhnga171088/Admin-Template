import { categoriesApi } from '@/lib/api/categories.api';
import type { ICategoryCreateRequest, ICategoryUpdateRequest } from '@/lib/api/categories.api';
import type { ICategory } from '@/types/types';

export const fetchAllCategories = (): Promise<ICategory[]> =>
  categoriesApi.getAll().then(r => r.data);

export const fetchCategoryById = (id: number): Promise<ICategory> =>
  categoriesApi.getById(id).then(r => r.data);

export const createCategory = (data: ICategoryCreateRequest): Promise<ICategory> =>
  categoriesApi.create(data).then(r => r.data);

export const updateCategory = (id: number, data: ICategoryUpdateRequest): Promise<ICategory> =>
  categoriesApi.update(id, data).then(r => r.data);

export const deleteCategory = (id: number): Promise<void> =>
  categoriesApi.remove(id).then(() => undefined);
