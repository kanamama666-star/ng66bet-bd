import pharaoh from '@/assets/pharaoh.jpg';
import aviator from '@/assets/aviator.jpg';
import luckyCat from '@/assets/lucky-cat.jpg';
import blackjack from '@/assets/blackjack.jpg';
import fishing from '@/assets/fishing.jpg';
import roulette from '@/assets/roulette.jpg';
export const games = [
 { id: 'pharaoh', title: 'Pharaoh’s Fortune', category: 'Slots', image: pharaoh, tag: 'POPULAR', provider: 'VELVET ORIGINALS', playable: true },
 { id: 'aviator', title: 'Aviator', category: 'Aviator', image: aviator, tag: 'HOT', provider: 'VELVET ORIGINALS', playable: true },
 { id: 'lucky-cat', title: 'Lucky Fortune', category: 'Slots', image: luckyCat, tag: 'NEW', provider: 'VELVET ORIGINALS', playable: true },
 { id: 'blackjack', title: 'Live Blackjack', category: 'Live Casino', image: blackjack, tag: 'LIVE', provider: 'PROVIDER CONNECTION PENDING', playable: false },
 { id: 'fishing', title: 'Ocean King', category: 'Fishing', image: fishing, tag: '', provider: 'PROVIDER CONNECTION PENDING', playable: false },
 { id: 'roulette', title: 'Royal Roulette', category: 'Table Games', image: roulette, tag: '', provider: 'PROVIDER CONNECTION PENDING', playable: false },
];
export type Game = typeof games[number];
