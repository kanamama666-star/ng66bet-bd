import { z } from 'zod';
export const reasonSchema = z.string().trim().min(3, 'Enter a reason of at least 3 characters.').max(500);
export const adjustmentSchema = z.object({ id: z.string().uuid(), amount: z.number().positive().max(10000000).refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.000001, 'Use at most two decimal places.'), operation: z.enum(['credit','debit']), reason: reasonSchema, requestId: z.string().uuid() });
export const editUserSchema = z.object({ id: z.string().uuid(), username: z.string().trim().min(2).max(60), phone: z.string().trim().max(20).regex(/^\+?[0-9]*$/, 'Use digits and an optional +.'), vip: z.boolean(), status: z.enum(['active','banned']), reason: reasonSchema });
export const gatewaySchema = z.object({ id: z.string().uuid().optional(), method: z.enum(['bKash','Nagad','Rocket']), account_type: z.enum(['agent','personal']), account_number: z.string().regex(/^01[0-9]{9}$/, 'Enter an 11-digit Bangladesh mobile number.'), active: z.boolean() });
export const reviewSchema = z.object({ id: z.string().uuid(), decision: z.enum(['approved','rejected']), reason: reasonSchema, payoutReference: z.string().trim().max(100).default('') });
export const paymentReviewSchema = reviewSchema.extend({kind:z.enum(['deposit','withdrawal']),transactionId:z.string().nullable(),proofPath:z.string().nullable()}).superRefine((r,ctx)=>{
 if(r.kind==='withdrawal'&&r.decision==='approved'&&r.payoutReference.length<3)ctx.addIssue({code:'custom',message:'A completed payout reference is required.',path:['payoutReference']});
 if(r.kind==='deposit'&&r.decision==='approved'&&(!r.transactionId||r.transactionId.trim().length<3||!r.proofPath?.trim()))ctx.addIssue({code:'custom',message:'A transaction ID and screenshot are required.'});
 if(!(r.kind==='withdrawal'&&r.decision==='approved')&&r.payoutReference)ctx.addIssue({code:'custom',message:'Payout references apply only to approved withdrawals.'});
});
export const noticeSchema = z.object({ message: z.string().trim().max(1000), active: z.boolean() }).refine(n => !n.active || n.message.length > 0, 'An active notice needs announcement text.');
export function matchesUser(user: {username: string; phone: string; status: string; vip: boolean}, search: string, filter: string) { const q=search.toLowerCase().trim(); return (user.username.toLowerCase().includes(q) || user.phone.includes(q)) && (filter==='all' || (filter==='vip' ? user.vip : user.status===filter)); }
