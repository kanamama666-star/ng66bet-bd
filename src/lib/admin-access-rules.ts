import {z} from 'zod';
import {reasonSchema} from './admin-validation';
export const playerAccessSchema=z.object({id:z.string().uuid(),vipLevel:z.number().int().min(0).max(41),frozen:z.boolean(),reason:reasonSchema});