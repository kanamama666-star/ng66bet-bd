import pharaoh from '@/assets/pharaoh.jpg';
import aviator from '@/assets/aviator.jpg';
import luckyCat from '@/assets/lucky-cat.jpg';
import blackjack from '@/assets/blackjack.jpg';
import fishing from '@/assets/fishing.jpg';
import roulette from '@/assets/roulette.jpg';
type Mode = 'crash' | 'slot' | 'unavailable';
const g = (id: string, title: string, bn: string, category: string, image: string, tag: string, provider: string, mode: Mode) =>
  ({ id, title, bn, category, image, tag, provider, mode, playable: mode !== 'unavailable' });
export const games = [
  g('aviator', 'Aviator', 'এভিয়েটর', 'Aviator', aviator, 'HOT', 'SPRIBE', 'crash'),
  g('super-ace', 'Super Ace', 'সুপার এস', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('wild-bounty', 'Wild Bounty Showdown', 'বন্য বাউন্টি শোটাউন', 'Slots', pharaoh, 'PG', 'PG SOFT', 'slot'),
  g('super-ace-deluxe', 'Super Ace Deluxe', 'সুপার এস ডিল্যাক্স', 'Slots', luckyCat, 'NEW', 'JILI', 'slot'),
  g('super-elements', 'Super Elements', 'সুপার এলিমেন্টস', 'Slots', pharaoh, 'FC', 'FA CHAI', 'slot'),
  g('boxing-king', 'Boxing King', 'বক্সিং কিং', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('fortune-gems-3', 'Fortune Gems 3', 'ফরচুন জেমস ৩', 'Slots', pharaoh, 'NEW', 'JILI', 'slot'),
  g('fortune-garuda-500', 'Fortune Garuda 500', 'গরুড় যোদ্ধা ৫০০', 'Slots', pharaoh, 'HOT', 'JDB', 'slot'),
  g('magic-ace-wild-lock', 'Magic Ace Wild Lock', 'ম্যাজিক এস WILD LOCK', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('crazy-time', 'Crazy Time', 'ক্রেজি টাইম', 'Live Casino', roulette, 'LIVE', 'EVOLUTION', 'unavailable'),
  g('flyx', 'FlyX', 'ফ্লাইএক্স', 'Aviator', aviator, 'HOT', 'TURBO', 'crash'),
  g('circus-joker-4096', 'Circus Joker 4096', 'সার্কাস জোকার ৪০৯৬', 'Slots', luckyCat, 'JDB', 'JDB', 'slot'),
  g('fortune-gems-2', 'Fortune Gems 2', 'ফরচুন জেমস ২', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('jetx', 'JetX', 'জেটএক্স', 'Aviator', aviator, 'HOT', 'SMARTSOFT', 'crash'),
  g('jackpot-fishing', 'Jackpot Fishing', 'জ্যাকপট ফিশিং', 'Fishing', fishing, 'JILI', 'JILI', 'unavailable'),
  g('fortune-king-jackpot', 'Fortune King Jackpot', 'ফরচুন কিং জ্যাকপট', 'Slots', pharaoh, 'JDB', 'JDB', 'slot'),
  g('happy-fishing', 'Happy Fishing', 'হ্যাপি ফিশিং', 'Fishing', fishing, 'NEW', 'JILI', 'unavailable'),
  g('money-coming', 'Money Coming', 'টাকা আসছে', 'Slots', luckyCat, 'HOT', 'JILI', 'slot'),
  g('treasures-of-aztec', 'Treasures of Aztec', 'আজটেক ধন', 'Slots', pharaoh, 'PG', 'PG SOFT', 'slot'),
  g('super-ace-2', 'Super Ace II', 'সুপার এস II', 'Slots', luckyCat, 'NEW', 'JILI', 'slot'),
  g('fortune-gems', 'Fortune Gems', 'ফরচুন জেমস', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('andar-bahar', 'Andar Bahar', 'আন্দর বাহার', 'Table Games', blackjack, 'LIVE', 'EZUGI', 'unavailable'),
  g('anubis-wrath', 'Anubis Wrath', 'আনুবিস', 'Slots', pharaoh, 'NEW', 'HACKSAW', 'slot'),
  g('pirate-legends', 'Pirate Legends', 'জলদস্যু কিংবদন্তি', 'Slots', fishing, 'FC', 'FA CHAI', 'slot'),
  g('money-coming-expanded', 'Money Coming Expanded Bets', 'মানি কামিং এক্সপ্যান্ড বেটস', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('go-rush', 'Go Rush', 'গো রাশ', 'Aviator', aviator, 'NEW', 'JILI', 'crash'),
  g('high-flyer', 'High Flyer', 'উচ্চ ফ্লায়ার', 'Aviator', aviator, 'HOT', 'PRAGMATIC', 'crash'),
  g('golden-empire', 'Golden Empire', 'গোল্ডেন এম্পায়ার', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('crazy-777', 'Crazy 777', 'ক্রেজি ৭৭৭', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('fortune-rabbit', 'Fortune Rabbit', 'ফরচুন র‍্যাবিট', 'Slots', luckyCat, 'PG', 'PG SOFT', 'slot'),
  g('ali-baba', 'Ali Baba', 'আলি বাবা', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
];
export type Game = typeof games[number];
