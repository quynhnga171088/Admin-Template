import { z } from 'zod';

import { type IAuthForm } from '@/types/types';

export const initialAuthFormValues: IAuthForm = {
  email: '',
  password: '',
  remember: false
};

export const authSchema = z.object({
  email: z.string().trim().min(1, 'Email is required!').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format!'),
  password: z.string().trim().min(8, 'Password must be at least 8 characters long!'),
  remember: z.boolean()
});

export type AuthFormData = z.infer<typeof authSchema>;
