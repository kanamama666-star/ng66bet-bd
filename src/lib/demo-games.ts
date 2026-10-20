import { Random, browserCrypto } from 'random-js';
export const DEMO_START_CREDITS = 1000;
export const DEMO_STAKE = 10;
export function slotPayout(reels: number[]) {
  return reels.length === 3 && reels.every(value => value === reels[0]) ? DEMO_STAKE * 20 : 0;
}
export function crashPoint(unit: number) {
  if (unit < 0 || unit >= 1) throw new Error('Invalid random sample');
  return Math.min(20, Math.floor(100 / (1 - unit)) / 100);
}
export function demoRandom() { return new Random(browserCrypto); }
