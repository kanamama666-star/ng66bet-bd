import c_ace from '@/assets/cover-ace.jpg';
import c_gems from '@/assets/cover-gems.jpg';
import c_garuda from '@/assets/cover-garuda.jpg';
import c_joker from '@/assets/cover-joker.jpg';
import c_jet from '@/assets/cover-jet.jpg';
import c_rocket from '@/assets/cover-rocket.jpg';
import c_money from '@/assets/cover-money.jpg';
import c_sevens from '@/assets/cover-777.jpg';
import c_wheel from '@/assets/cover-wheel.jpg';
import c_anubis from '@/assets/cover-anubis.jpg';
import c_aztec from '@/assets/cover-aztec.jpg';
import c_pirate from '@/assets/cover-pirate.jpg';
import c_western from '@/assets/cover-western.jpg';
import c_boxing from '@/assets/cover-boxing.jpg';
import c_lunar from '@/assets/cover-lunar.jpg';
import c_fruit from '@/assets/cover-fruit.jpg';
import c_mahjong from '@/assets/cover-mahjong.jpg';
import c_fish from '@/assets/cover-fish.jpg';
import c_biplane from '@/assets/cover-biplane.jpg';
import c_fiesta from '@/assets/cover-fiesta.jpg';
import c_athena from '@/assets/cover-athena.jpg';
import c_coins from '@/assets/cover-coins.jpg';
import c_arabian from '@/assets/cover-arabian.jpg';
import c_elements from '@/assets/cover-elements.jpg';
import c_ice from '@/assets/cover-ice.jpg';
import c_cards from '@/assets/cover-cards.jpg';
import pharaoh from '@/assets/pharaoh.jpg';
import aviator from '@/assets/aviator.jpg';
import luckyCat from '@/assets/lucky-cat.jpg';
import blackjack from '@/assets/blackjack.jpg';
import fishing from '@/assets/fishing.jpg';
import roulette from '@/assets/roulette.jpg';
const covers: Record<string, string> = {'aviator': aviator,'super-ace': c_ace,'wild-bounty': c_western,'super-ace-deluxe': c_ace,'super-elements': c_elements,'boxing-king': c_boxing,'fortune-gems-3': c_gems,'fortune-garuda-500': c_garuda,'magic-ace-wild-lock': c_ace,'crazy-time': c_wheel,'flyx': c_jet,'circus-joker-4096': c_joker,'fortune-gems-2': c_gems,'jetx': c_jet,'jackpot-fishing': c_fish,'fortune-king-jackpot': c_coins,'happy-fishing': c_fish,'money-coming': c_money,'treasures-of-aztec': c_aztec,'super-ace-2': c_ace,'fortune-gems': c_gems,'andar-bahar': c_cards,'anubis-wrath': c_anubis,'pirate-legends': c_pirate,'money-coming-expanded': c_money,'go-rush': c_rocket,'high-flyer': c_biplane,'golden-empire': c_aztec,'crazy-777': c_sevens,'fortune-rabbit': c_lunar,'ali-baba': c_arabian,'cny-moreways': c_lunar,'pinata-wins': c_fiesta,'wild-bandito': c_fiesta,'fruity-bonanza': c_fruit,'ice-fishing': c_ice,'mega-wheel': c_wheel,'clover-coins': c_coins,'classic-777': c_sevens,'fortune-dragon': c_lunar,'jackpot-joker': c_joker,'dragon-gems-500': c_gems,'sugar-teddy': c_fruit,'super-elements-2': c_elements,'fortune-garuda-1000': c_garuda,'poker-win': c_joker,'calavera-fiesta': c_fiesta,'lucky-jaguar': c_mahjong,'lucky-neko': c_lunar,'athena-rising': c_athena,'flyx-cash-turbo': c_jet,'super-ace-speed': c_ace,'3-super-ace': c_ace,'mahjong-ways': c_mahjong,'coin-up': c_coins,'mighty-sevens': c_sevens,'fortune-coins': c_coins};
type Mode = 'crash' | 'slot' | 'unavailable';
const hues: Record<string, number> = { aviator: 20, flyx: 0, jetx: 280, 'go-rush': 250, 'high-flyer': 310, 'crazy-time': 150, 'mega-wheel': 200, 'andar-bahar': 30, 'jackpot-fishing': 230, 'happy-fishing': 220, 'ice-fishing': 210, 'money-coming': 145, 'money-coming-expanded': 300, 'super-elements': 260, 'boxing-king': 25, 'magic-ace-wild-lock': 275, 'circus-joker-4096': 320, 'anubis-wrath': 70, 'pirate-legends': 15, 'super-ace-2': 140, 'super-ace': 135, 'super-ace-deluxe': 130, 'fortune-rabbit': 350, 'fruity-bonanza': 290, 'clover-coins': 150, 'jackpot-joker': 315, 'pinata-wins': 330, 'cny-moreways': 10, 'wild-bandito': 300 };
const g = (id: string, title: string, bn: string, category: string, image: string, tag: string, provider: string, mode: Mode) =>
  ({ id, title, bn, category, image: covers[id] ?? image, tag, provider, mode, hue: hues[id] ?? 75, playable: mode !== 'unavailable' });
export const games = [
  g('aviator', 'Aviator', 'এভিয়েটর', 'Aviator', aviator, 'HOT', 'SPRIBE', 'crash'),
  g('super-ace', 'Super Ace', 'সুপার এস', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('wild-bounty', 'Wild Bounty Showdown', 'বন্য বাউন্টি শোটাউন', 'Slots', pharaoh, 'PG', 'PG SOFT', 'slot'),
  g('super-ace-deluxe', 'Super Ace Deluxe', 'সুপার এস ডিলাক্স', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('super-elements', 'Super Elements', 'সুপার এলিমেন্টস', 'Slots', pharaoh, 'FC', 'FA CHAI', 'slot'),
  g('boxing-king', 'Boxing King', 'বক্সিং কিং', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('fortune-gems-3', 'Fortune Gems 3', 'ফরচুন জেমস ৩', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('fortune-garuda-500', 'Fortune Garuda 500', 'গরুড় যোদ্ধা 500', 'Slots', pharaoh, 'HOT', 'JDB', 'slot'),
  g('magic-ace-wild-lock', 'Magic Ace Wild Lock', 'ম্যাজিক এস WILD LOCK', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('crazy-time', 'Crazy Time', 'ক্রেজি টাইম', 'Live Casino', roulette, '', 'EVOLUTION', 'unavailable'),
  g('flyx', 'FlyX', 'ফ্লাইএক্স', 'Aviator', aviator, 'HOT', 'TURBO', 'crash'),
  g('circus-joker-4096', 'Circus Joker 4096', 'সার্কাস জোকার ৪০৯৬', 'Slots', luckyCat, 'JDB', 'JDB', 'slot'),
  g('fortune-gems-2', 'Fortune Gems 2', 'ফরচুন জেমস ২', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('jetx', 'JetX', 'JetX', 'Aviator', aviator, 'HOT', 'SMARTSOFT', 'crash'),
  g('jackpot-fishing', 'Jackpot Fishing', 'জ্যাকপট ফিশিং', 'Fishing', fishing, 'JILI', 'JILI', 'unavailable'),
  g('fortune-king-jackpot', 'Fortune King Jackpot', 'ফরচুন কিং জ্যাকপট', 'Slots', pharaoh, 'JDB', 'JDB', 'slot'),
  g('happy-fishing', 'Happy Fishing', 'হ্যাপি ফিশিং', 'Fishing', fishing, 'JILI', 'JILI', 'unavailable'),
  g('money-coming', 'Money Coming', 'টাকা আসছে', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('treasures-of-aztec', 'Treasures of Aztec', 'আজটেক ধন', 'Slots', pharaoh, 'PG', 'PG SOFT', 'slot'),
  g('super-ace-2', 'Super Ace II', 'সুপার এস II', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('fortune-gems', 'Fortune Gems', 'ফরচুন জেমস', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('andar-bahar', 'Andar Bahar', 'আন্দর বাহার', 'Table Games', blackjack, 'LIVE', 'EZUGI', 'unavailable'),
  g('anubis-wrath', 'Anubis Wrath', 'আনুবিস', 'Slots', pharaoh, 'NEW', 'HACKSAW', 'slot'),
  g('pirate-legends', 'Pirate Legends', 'জলদস্যু কিংবদন্তি', 'Slots', fishing, 'FC', 'FA CHAI', 'slot'),
  g('money-coming-expanded', 'Money Coming Expanded Bets', 'মানি কামিং এক্সপ্যান্ড বেটস', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('go-rush', 'Go Rush', 'গো রাশ', 'Aviator', aviator, 'JILI', 'JILI', 'crash'),
  g('high-flyer', 'High Flyer', 'উচ্চ ফ্লায়ার', 'Aviator', aviator, 'HOT', 'PRAGMATIC', 'crash'),
  g('golden-empire', 'Golden Empire', 'গোল্ডেন এম্পায়ার', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('crazy-777', 'Crazy 777', 'ক্রেজি৭৭৭', 'Slots', luckyCat, 'JILI', 'JILI', 'slot'),
  g('fortune-rabbit', 'Fortune Rabbit', 'ফরচুন র্যাবিট', 'Slots', luckyCat, 'PG', 'PG SOFT', 'slot'),
  g('ali-baba', 'Ali Baba', 'আলি বাবা', 'Slots', pharaoh, 'JILI', 'JILI', 'slot'),
  g('cny-moreways', 'Chinese New Year Moreways', 'চাইনিজ নিউ ইয়ার আরও...', 'Slots', luckyCat, '', 'FA CHAI', 'slot'),
  g('pinata-wins', 'Pinata Wins', 'পিনাটা জয়', 'Slots', luckyCat, '', 'PG SOFT', 'slot'),
  g('wild-bandito', 'Wild Bandito', 'বন্য ব্যান্ডিটো', 'Slots', pharaoh, '', 'PG SOFT', 'slot'),
  g('fruity-bonanza', 'Fruity Bonanza', 'নক্ষত্রমণ্ডল ফলের অধিপতি', 'Slots', luckyCat, '', 'FA CHAI', 'slot'),
  g('ice-fishing', 'Ice Fishing', 'বরফে মাছ ধরা', 'Live Casino', fishing, '', 'EVOLUTION', 'unavailable'),
  g('mega-wheel', 'Mega Wheel', 'মেগা হুইল', 'Live Casino', roulette, '', 'PRAGMATIC', 'unavailable'),
  g('clover-coins', 'Clover Coins 3x3', 'ক্লোভার কয়েন 3x3', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('classic-777', '777 Classic Style', '৭৭৭-ক্লাসিক', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('fortune-dragon', 'Fortune Dragon', 'ভাগ্যবান ড্রাগন', 'Slots', pharaoh, '', 'PG SOFT', 'slot'),
  g('jackpot-joker', 'Jackpot Joker', 'জ্যাকপট জোকার', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('dragon-gems-500', 'Dragon Gems 500', 'ড্রাগন রত্ন ৫০০', 'Slots', pharaoh, '', 'JDB', 'slot'),
  g('sugar-teddy', 'Sugar Teddy x1000', 'সুগার টেডি x1000', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('super-elements-2', 'Super Elements 2', 'সুপার এলিমেন্টস 2', 'Slots', luckyCat, '', 'FA CHAI', 'slot'),
  g('fortune-garuda-1000', 'Fortune Garuda 1000', 'ফরচুন গরুড় ১০০০', 'Slots', pharaoh, '', 'JDB', 'slot'),
  g('poker-win', 'Poker Win', 'পোকার উইন', 'Slots', luckyCat, '', 'FA CHAI', 'slot'),
  g('calavera-fiesta', 'Calavera Fiesta', 'কালাভেরা ফিয়েস্তা', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('lucky-jaguar', 'Lucky Jaguar', 'লাকি জাগুয়ার', 'Slots', pharaoh, '', 'JDB', 'slot'),
  g('lucky-neko', 'Lucky Neko', 'লাকি নেকো', 'Slots', luckyCat, 'PG', 'PG SOFT', 'slot'),
  g('athena-rising', 'Wild Athena Rising 2048', 'ওয়াইল্ড অ্যাথেনা রাইজিং ২০৪৮', 'Slots', pharaoh, '', 'JDB', 'slot'),
  g('flyx-cash-turbo', 'FlyX Cash Turbo', 'ফ্লাইX ক্যাশ টার্বো', 'Slots', aviator, '', 'TURBO', 'crash'),
  g('super-ace-speed', 'Super Ace Speed', 'সুপার এস SPEED', 'Slots', luckyCat, '', 'JILI', 'slot'),
  g('3-super-ace', '3 Super Ace', '৩ সুপার এস', 'Slots', luckyCat, '', 'TADA', 'slot'),
  g('mahjong-ways', 'Mahjong Ways', 'Mahjong Ways', 'Slots', pharaoh, '', 'PG SOFT', 'slot'),
  g('coin-up', 'Coin Up: Hot Fire', 'কয়েন আপ: হট ফায়ার', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('mighty-sevens', 'Mighty Sevens', 'মাইটিসেভেনস্', 'Slots', luckyCat, '', 'JDB', 'slot'),
  g('fortune-coins', 'Fortune Coins', 'ফরচুন কয়েন', 'Slots', pharaoh, '', 'JDB', 'slot'),
];
// The first 31 entries are the Popular lineup from the reference screenshots.
export const popularIds = new Set(games.slice(0, 31).map(x => x.id));
// Slots tab order follows the reference Slots screenshots; other slots follow.
const slotOrder = ['super-ace','wild-bounty','super-elements','circus-joker-4096','magic-ace-wild-lock','fortune-gems-3','super-ace-2','boxing-king','super-ace-deluxe','dragon-gems-500','fortune-garuda-500','treasures-of-aztec','anubis-wrath','sugar-teddy','pinata-wins','pirate-legends','super-elements-2','fortune-gems','golden-empire','money-coming','fortune-garuda-1000','cny-moreways','fruity-bonanza','poker-win','fortune-gems-2','calavera-fiesta','wild-bandito','lucky-jaguar','lucky-neko','clover-coins','athena-rising','flyx-cash-turbo','money-coming-expanded','crazy-777','fortune-rabbit','super-ace-speed','3-super-ace','mahjong-ways','coin-up','mighty-sevens','fortune-coins'];
export const slotRank = (id: string) => { const i = slotOrder.indexOf(id); return i < 0 ? 999 : i; };
export type Game = typeof games[number];
