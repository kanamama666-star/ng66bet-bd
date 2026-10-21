import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {feedbackSchema} from './member-rules';
export const getMemberRecords=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const db=context.supabase,id=context.userId;
 // Page through owner-scoped records so totals never silently truncate at the Data API limit.
 async function all<T>(read:(from:number,to:number)=>PromiseLike<{data:T[]|null;error:unknown}>){const rows:T[]=[];for(let offset=0;;offset+=1000){const result=await read(offset,offset+999);if(result.error)throw new Error('অ্যাকাউন্টের তথ্য লোড করা যায়নি।');rows.push(...(result.data??[]));if((result.data?.length??0)<1000)return rows;}}
 const [payments,vip,mystery,referral,refs,tiers,ledger,activity,feedback]=await Promise.all([
 all((a,b)=>db.from('payment_requests').select('*').eq('user_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('vip_bonus_awards').select('id,kind,amount,created_at,level').eq('user_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('mystery_bonus_awards').select('id,amount,created_at').eq('user_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('referral_rewards').select('id,kind,amount,created_at').eq('referrer_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('referrals').select('referred_id,status,created_at').eq('referrer_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('vip_tiers').select('*').order('level').range(a,b)),
 all((a,b)=>db.from('financial_ledger').select('id,kind,amount,balance_after,created_at').eq('user_id',id).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('account_activity').select('id,kind,amount,balance_after,created_at').eq('user_id',id).not('amount','is',null).order('created_at',{ascending:false}).range(a,b)),
 all((a,b)=>db.from('player_feedback').select('id,category,message,created_at').eq('user_id',id).order('created_at',{ascending:false}).range(a,b))]);
 const rewards=[...vip.map(r=>({...r,kind:'VIP · '+r.kind})),...mystery.map(r=>({...r,kind:'রহস্য বোনাস'})),...referral.map(r=>({...r,kind:'রেফারেল · '+r.kind}))].sort((a,b)=>b.created_at.localeCompare(a.created_at));
 // Bonuses also have activity rows: use the posted activity, not both, to avoid double-counting.
 const records=[...ledger,...activity.map(r=>({...r,amount:r.kind==='debit'?-Number(r.amount):Number(r.amount)}))].sort((a,b)=>b.created_at.localeCompare(a.created_at));
 return {payments,rewards,refs,tiers,records,feedback};
});
export const submitMemberFeedback=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(d=>feedbackSchema.parse(d)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('player_feedback').insert({...data,user_id:context.userId});if(error)throw new Error('বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।');return {success:true};
});
