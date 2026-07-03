import { z } from 'zod';
import { STATE } from '@/config/constant';
import type { ICourseCreateRequest, ICourseStatus } from '@/types/types';

export const initialCourseFormValues: ICourseCreateRequest = {
  title: '',
  shortDescription: '',
  description: '',
  thumbnailUrl: '',
  price: 0,
  status: STATE.DRAFT as ICourseStatus,
  categoryId: null,
  levelId: null
};

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Course title is required.')
    .max(200, 'Course title must not exceed 200 characters.'),
  shortDescription: z
    .string()
    .trim()
    .min(1, 'Short description is required.')
    .max(480, 'Short description must not exceed 500 characters.'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(5000, 'Description must not exceed 5000 characters.'),
  thumbnailUrl: z.string(),
  price: z
    .coerce.number({ error: 'Price must be a number.' })
    .min(0, 'Price cannot be negative.'),
  status: z.enum(
    [STATE.DRAFT, STATE.PUBLISHED, STATE.ARCHIVED] as [ICourseStatus, ...ICourseStatus[]],
    { error: 'Invalid status value.' }
  ),
  categoryId: z
    .number({ error: 'Category is required.' })
    .int()
    .positive('Category is required.')
    .nullable()
    .refine(val => val !== null, { message: 'Category is required.' }),
  levelId: z
    .number({ error: 'Level is required.' })
    .int()
    .positive('Level is required.')
    .nullable()
    .refine(val => val !== null, { message: 'Level is required.' })
});

export type CourseFormData = z.infer<typeof courseSchema>;
