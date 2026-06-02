import { z } from 'zod';

export const initialRegisterFormValues = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  avatarUrl: ''
};

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters!')
      .max(100, 'Full name must not exceed 100 characters!'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required!')
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format!'
      ),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone number is required!')
      .regex(/^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/, 'Invalid Vietnamese phone number!'),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters!')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter!')
      .regex(/[0-9]/, 'Password must contain at least one number!'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password!')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword']
  });
