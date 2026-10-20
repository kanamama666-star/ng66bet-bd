import { z } from 'zod';
export const usernameSchema = z.string().trim().regex(/^[A-Za-z0-9]{6,13}$/, 'ইউজার নেম 6-13টি ইংরেজি অক্ষর বা সংখ্যা হতে হবে');
export const phoneSchema = z.string().trim().regex(/^01[3-9]\d{8}$/, 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)');
export const passwordSchema = z.string().min(8, 'পাসওয়ার্ড কমপক্ষে 8 অক্ষর').max(128);
const deviceSchema = z.string().trim().max(64).regex(/^[A-Za-z0-9-]*$/).optional();
export const referralCodeSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9]{8}$/).optional();
export const loginSchema = z.object({ identifier: z.string().trim().min(6).max(20), password: passwordSchema, deviceId: deviceSchema });
export const registerSchema = z.object({ username: usernameSchema, phone: phoneSchema, password: passwordSchema, deviceId: deviceSchema, ref: referralCodeSchema });
/** Players without email get a non-deliverable internal address derived from their phone. */
export const internalEmail = (phone: string) => `p${phone}@players.ng66.invalid`;
