import { z } from 'zod';

export const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required').max(255, 'Max 255 characters'),
  description: z.string().optional(),
  avatar: z.string().max(50, 'Avatar must not exceed 50 characters').optional()
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const initialCategoryFormValues: CategoryFormData = {
  categoryName: '',
  description: '',
  avatar: ''
};
