import { describe, it, expect } from 'vitest';
import { usernameSchema, phoneSchema, loginSchema } from '@/lib/player-auth-rules';
describe('player auth rules', () => {
 it('username must be 6-13 letters/digits', () => {
  expect(usernameSchema.safeParse('abc12').success).toBe(false);
  expect(usernameSchema.safeParse('player01').success).toBe(true);
  expect(usernameSchema.safeParse('abcdefghijklmn').success).toBe(false);
  expect(usernameSchema.safeParse('play_er01').success).toBe(false);
 });
 it('phone must be a Bangladesh mobile number', () => {
  expect(phoneSchema.safeParse('01712345678').success).toBe(true);
  expect(phoneSchema.safeParse('01212345678').success).toBe(false);
 });
 it('login accepts username or phone', () => {
  expect(loginSchema.safeParse({ identifier: 'player01', password: 'secret123' }).success).toBe(true);
  expect(loginSchema.safeParse({ identifier: '01712345678', password: 'secret123' }).success).toBe(true);
 });
});
