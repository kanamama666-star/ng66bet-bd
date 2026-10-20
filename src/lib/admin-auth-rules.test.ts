import { expect, it } from 'vitest';
import { adminLoginSchema, adminRegistrationSchema } from './admin-auth-rules';
it('requires email instead of a player username',()=>{
 expect(adminLoginSchema.safeParse({email:'kanamama',password:'test'}).success).toBe(false);
 expect(adminLoginSchema.parse({email:' KanaMama666@gmail.com ',password:'test'}).email).toBe('kanamama666@gmail.com');
});
it('requires 12 characters for new administrator passwords',()=>{
 expect(adminRegistrationSchema.safeParse({email:'kanamama666@gmail.com',password:'short'}).success).toBe(false);
 expect(adminRegistrationSchema.safeParse({email:'kanamama666@gmail.com',password:'LongEnough-12345'}).success).toBe(true);
});