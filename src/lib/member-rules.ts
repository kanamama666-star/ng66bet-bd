import { z } from 'zod';
export const feedbackSchema = z.object({ category: z.enum(['feedback', 'support']), message: z.string().trim().min(5).max(2000) });
export type PaymentRecord = {kind:string;status:string;amount:number;reviewed_at:string|null};
export function approvedDeposits(rows:PaymentRecord[], from = '', to = '9999') {
 return rows.filter(r=>r.kind==='deposit' && r.status==='approved' && r.reviewed_at && r.reviewed_at>=from && r.reviewed_at<to).reduce((n,r)=>n+Number(r.amount),0);
}
export function progress(value:number,target:number){return target>0?Math.min(100,Math.max(0,value/target*100)):0;}
export function dhakaPeriods(now:Date){
 const local=new Date(now.getTime()+6*3600000);const day=local.toISOString().slice(0,10);const week=new Date(local);week.setUTCDate(week.getUTCDate()-((week.getUTCDay()+6)%7));
 const start=(s:string)=>new Date(`${s}T00:00:00+06:00`).toISOString();
 return {day:start(day),week:start(week.toISOString().slice(0,10)),month:start(day.slice(0,7)+'-01')};
}
