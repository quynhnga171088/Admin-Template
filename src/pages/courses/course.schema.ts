import { z } from 'zod';
import { STATE } from '@/config/constant';
import type { ICourseCreateRequest } from '@/types/types';

export const initialCourseFormValues: ICourseCreateRequest = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  thumbnailUrl: '',
  price: 0,
  status: 'DRAFT'
};

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Course title is required.')
    .max(200, 'Course title must not exceed 200 characters.'),
  shortDescription: z
    .string()
    .max(500, 'Short description must not exceed 500 characters.')
    .optional(),
  fullDescription: z
    .string()
    .max(5000, 'Full description must not exceed 5000 characters.')
    .optional(),
  thumbnailUrl: z.string().optional(),
  price: z
    .number({ invalid_type_error: 'Price must be a number.' })
    .min(0, 'Price cannot be negative.'),
  status: z.enum(
    [STATE.DRAFT, STATE.PUBLISHED, STATE.ARCHIVED] as [string, ...string[]],
    { errorMap: () => ({ message: 'Invalid status value.' }) }
  )
});

export type CourseFormData = z.infer<typeof courseSchema>;
