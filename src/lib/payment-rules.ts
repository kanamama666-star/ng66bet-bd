import { z } from 'zod';
export const paymentSchema = z.object({
 kind: z.enum(['deposit','withdrawal']),
 method: z.enum(['bKash','Nagad']),
 amount: z.coerce.number().positive('Amount must be greater than zero').max(999999999999.99).refine(v => Math.abs(v*100-Math.round(v*100))<0.0001,'Use no more than two decimal places'),
 account_number: z.string().trim().regex(/^01[3-9]\d{8}$/, 'Enter a valid Bangladesh mobile number'),
 transaction_id: z.string().trim().max(80).optional(),
}).superRefine((data,ctx) => { if(data.kind==='deposit' && !data.transaction_id) ctx.addIssue({code:'custom',path:['transaction_id'],message:'Transaction ID is required'}); });
export const receiptTypes = ['image/png','image/jpeg','image/webp'];
export function validateReceipt(file: {size:number;type:string}) {
 if(!receiptTypes.includes(file.type)) return 'Choose a JPG, PNG or WebP image';
 if(file.size>5*1024*1024) return 'Screenshot must be under 5 MB';
 return null;
}
