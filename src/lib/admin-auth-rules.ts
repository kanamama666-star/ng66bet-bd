import { z } from 'zod';
export const adminLoginSchema = z.object({email: z.string().trim().email().transform(v=>v.toLowerCase()), password: z.string().min(1).max(128)});
export const adminRegistrationSchema = adminLoginSchema.extend({password: z.string().min(12, 'Use at least 12 characters.').max(128)});