import {describe,it,expect} from 'vitest';
import {approvedDeposits,progress,dhakaPeriods} from './member-rules';
describe('member account figures',()=>{
 it('counts only approved deposits, never pending requests or withdrawals',()=>expect(approvedDeposits([{kind:'deposit',status:'approved',amount:300,reviewed_at:'2026-10-21'},{kind:'deposit',status:'pending',amount:900,reviewed_at:null},{kind:'withdrawal',status:'approved',amount:100,reviewed_at:'2026-10-21'}])).toBe(300));
 it('uses review time for mission progress',()=>expect(approvedDeposits([{kind:'deposit',status:'approved',amount:300,reviewed_at:'2026-10-20'}],'2026-10-21')).toBe(0));
 it('keeps mission progress within its goal',()=>expect(progress(3000,300)).toBe(100));
 it('starts daily tracking at midnight Dhaka time',()=>expect(dhakaPeriods(new Date('2026-10-21T04:22:00Z')).day).toBe('2026-10-20T18:00:00.000Z'));
});
