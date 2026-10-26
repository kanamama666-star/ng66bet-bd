import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { SCORPIO_GAMES } from './scorpio-games';

// Launches an allowlisted ScorpioPlay game for the signed-in player only.
export const launchScorpioGame = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ slug: z.string().max(40) }).parse(d))
  .handler(async ({ data, context }) => {
    const game = SCORPIO_GAMES[data.slug];
    if (!game) return { error: 'এই গেমটি পাওয়া যায়নি।' };
    const { data: profile } = await context.supabase.from('profiles').select('status').eq('id', context.userId).single();
    if (profile?.status === 'banned') return { error: 'আপনার অ্যাকাউন্ট স্থগিত আছে। সাপোর্টে যোগাযোগ করুন।' };
    const base = process.env['SCORPIO_PLAY_BASE_URL'] ?? 'https://api.scorpioplay.com';
    const token = process.env['SCORPIO_PLAY_API_TOKEN'];
    if (!token) return { error: 'গেম সার্ভার কনফিগার করা হয়নি।' };
    const call = async (path: string, body: unknown) => {
      const res = await fetch(base + path, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
      return (await res.json().catch(() => ({}))) as { success?: boolean; code?: string; message?: string; data?: { gameUrl?: string } };
    };
    try {
      const playerExternalId = context.userId;
      const created = await call('/v1/player/create', { playerExternalId });
      if (!created.success && created.code !== 'PLAYER_ALREADY_EXISTS') console.warn('scorpio player/create', created.code, created.message);
      const launch = await call('/v1/game/launch', { playerExternalId, providerId: game.providerId, gameCode: game.gameCode, language: 'en', currency: 'USD', rtp: 0 });
      if (!launch.success || !launch.data?.gameUrl) { console.error('scorpio launch', launch.code, launch.message); return { error: 'গেমটি এখন চালু করা যাচ্ছে না। পরে আবার চেষ্টা করুন।' }; }
      return { url: launch.data.gameUrl };
    } catch (e) {
      console.error('scorpio launch failed', e);
      return { error: 'গেম সার্ভারে সংযোগ করা যায়নি।' };
    }
  });
