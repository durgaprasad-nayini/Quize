import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().max(50, 'Name is too long').optional().transform((value) => value ?? ''),
  email: z.string().trim().toLowerCase().email('A valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
