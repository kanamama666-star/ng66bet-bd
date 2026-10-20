import {describe,it,expect} from 'vitest';
import {slotPayout,DEMO_START_CREDITS,crashPoint} from '@/lib/demo-games';
import {paymentSchema,validateReceipt} from '@/lib/payment-rules';
describe('Transparent demo rules',()=>{
 it('keeps demo funds independent with 1000 starting credits',()=>{expect(DEMO_START_CREDITS).toBe(1000);});
 it('pays only three matching reels',()=>{expect(slotPayout([2,2,2])).toBe(200);expect(slotPayout([2,2,1])).toBe(0);});
 it('samples a crash point before flight with a fixed cap',()=>{expect(crashPoint(0)).toBe(1);expect(crashPoint(.5)).toBe(2);expect(crashPoint(.999)).toBe(20);});
});
describe('Payment request rules',()=>{
 const deposit={kind:'deposit',method:'bKash',amount:100,account_number:'01712345678',transaction_id:'ABC123'};
 it('accepts bKash, Nagad and Rocket only',()=>{expect(paymentSchema.safeParse(deposit).success).toBe(true);expect(paymentSchema.safeParse({...deposit,method:'Nagad'}).success).toBe(true);expect(paymentSchema.safeParse({...deposit,method:'Rocket'}).success).toBe(true);expect(paymentSchema.safeParse({...deposit,method:'Other'}).success).toBe(false);});
 it('requires TxID for deposits',()=>{expect(paymentSchema.safeParse({...deposit,transaction_id:''}).success).toBe(false);});
 it('rejects zero and fractional-paisa amounts',()=>{expect(paymentSchema.safeParse({...deposit,amount:0}).success).toBe(false);expect(paymentSchema.safeParse({...deposit,amount:1.001}).success).toBe(false);});
 it('requires image screenshots',()=>{expect(validateReceipt({size:100,type:'image/png'})).toBe(null);expect(validateReceipt({size:100,type:'text/html'})).not.toBe(null);});
});
