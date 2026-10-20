import {expect,it} from 'vitest';
import {playerAccessSchema} from './admin-access-rules';
const value={id:'11111111-1111-4111-8111-111111111111',vipLevel:40,frozen:true,reason:'Fraud reviewed'};
it('allows VIP levels through the existing VIP 40+ tier',()=>{expect(playerAccessSchema.safeParse(value).success).toBe(true);expect(playerAccessSchema.safeParse({...value,vipLevel:41}).success).toBe(true);expect(playerAccessSchema.safeParse({...value,vipLevel:42}).success).toBe(false);});
it('requires a reason to release a frozen account',()=>{expect(playerAccessSchema.safeParse({...value,frozen:false}).success).toBe(true);expect(playerAccessSchema.safeParse({...value,frozen:false,reason:''}).success).toBe(false);});