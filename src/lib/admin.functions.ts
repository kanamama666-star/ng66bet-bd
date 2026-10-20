import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { adjustmentSchema, editUserSchema, gatewaySchema, reviewSchema, noticeSchema } from './admin-validation';

export const getAdminAccess = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const {data,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 if(error) throw new Error('Unable to verify administrator access.');
 const {data:profile}=await context.supabase.from('profiles').select('status').eq('id',context.userId).maybeSingle();
 return {allowed: data===true && profile?.status!=='banned'};
});
export const getAdminData = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async ({context}) => {
 const {data:allowed,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 const {data:profile}=await context.supabase.from('profiles').select('status').eq('id',context.userId).maybeSingle();
 if(error || !allowed || profile?.status==='banned') throw new Error('Administrator access required.');
 const db=context.supabase;
 const results=await Promise.all([db.from('profiles').select('*').order('created_at',{ascending:false}).limit(1000),db.from('account_activity').select('*').order('created_at',{ascending:false}).limit(1000),db.from('payment_requests').select('*').order('created_at',{ascending:false}).limit(1000),db.from('payment_gateways').select('*').order('method'),db.from('content_banners').select('*').order('created_at',{ascending:false}),db.from('site_notices').select('*').eq('id','announcement').maybeSingle(),db.from('financial_ledger').select('*').order('created_at',{ascending:false}).limit(1000)]);
 for(const result of results) if(result.error) throw new Error('Unable to load admin records. Please try again.');
 return {users:results[0].data??[],activity:results[1].data??[],requests:results[2].data??[],gateways:results[3].data??[],banners:results[4].data??[],notice:results[5].data,ledger:results[6].data??[]};
});
export const adjustBalance = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>adjustmentSchema.parse(input)).handler(async({data,context})=>{ const {error}=await context.supabase.rpc('adjust_account_balance',{_user_id:data.id,_amount:data.amount,_operation:data.operation,_reason:data.reason,_request_id:data.requestId}); if(error)throw new Error(error.message); return {success:true}; });
export const editUser = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>editUserSchema.parse(input)).handler(async({data,context})=>{ const {error}=await context.supabase.rpc('edit_account',{_user_id:data.id,_username:data.username,_phone:data.phone,_vip:data.vip,_status:data.status,_reason:data.reason}); if(error)throw new Error(error.message); return {success:true}; });
export const reviewPayment = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>reviewSchema.parse(input)).handler(async({data,context})=>{ const {error}=await context.supabase.rpc('review_payment_request',{_id:data.id,_decision:data.decision,_reason:data.reason,_payout_reference:data.payoutReference}); if(error)throw new Error(error.message);return {success:true}; });
export const resetUserPassword = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({id:z.string().uuid(),password:z.string().min(12).max(128)}).parse(input)).handler(async({data,context})=>{
 const {data:allowed,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 const {data:profile}=await context.supabase.from('profiles').select('status').eq('id',context.userId).maybeSingle();
 if(error||!allowed||profile?.status==='banned')throw new Error('Administrator access required.');
 if(data.id===context.userId)throw new Error('Use the recovery email for your own administrator password.');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 // Write a durable intent before the external Auth operation; no passwords are recorded.
 const {data:event,error:auditError}=await supabaseAdmin.from('account_activity').insert({user_id:data.id,actor_id:context.userId,kind:'password_reset',reason:'Administrator password reset requested'}).select('id').single();
 if(auditError)throw new Error('Unable to record password-reset audit.');
 const {error:resetError}=await supabaseAdmin.auth.admin.updateUserById(data.id,{password:data.password});
 await supabaseAdmin.from('account_activity').update({reason:resetError?'Password reset failed':'Administrator password reset completed'}).eq('id',event.id);
 if(resetError)throw new Error('Password reset failed. Check password requirements and try again.');return {success:true};
});
export const saveGateway = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>gatewaySchema.parse(input)).handler(async({data,context})=>{
 const {data:allowed}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});
 const {data:p}=await context.supabase.from('profiles').select('status').eq('id',context.userId).maybeSingle();
 if(!allowed||p?.status==='banned')throw new Error('Administrator access required.');
 const {id,...fields}=data;
 const {error}=await context.supabase.from('payment_gateways').upsert({...fields,...(id?{id}:{}),updated_at:new Date().toISOString()}); if(error)throw new Error('Unable to save gateway. Check for a duplicate number.');return {success:true};
});
export const saveNotice = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>noticeSchema.parse(input)).handler(async({data,context})=>{
 const {data:allowed}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'});const {data:p}=await context.supabase.from('profiles').select('status').eq('id',context.userId).maybeSingle();if(!allowed||p?.status==='banned')throw new Error('Administrator access required.');
 const {error}=await context.supabase.from('site_notices').upsert({id:'announcement',...data,updated_at:new Date().toISOString()});if(error)throw new Error('Unable to save announcement.');return {success:true};
});
