export interface CreativeAvatar {
  id: string;
  name: string;
  title: string;
  category: 'Mythic' | 'Sci-Fi' | 'Math Genius' | 'Cosmic';
  accentColor: string;
  bgGradient: string;
  iconSymbol: string;
  url: string;
  description: string;
}

export const CREATIVE_AVATARS: CreativeAvatar[] = [
  {
    id: 'avatar-cosmic-owl',
    name: 'Cosmic Owl',
    title: 'Donishmand Boyqush',
    category: 'Cosmic',
    accentColor: '#3B82F6',
    bgGradient: 'from-indigo-600 to-blue-500',
    iconSymbol: '🦉',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CosmicOwl&backgroundColor=b6e3f4,c0aede,d1d4f9',
    description: '1600 ballik mantiqiy tahlil va chuqur tafakkur ramzi',
  },
  {
    id: 'avatar-golden-phoenix',
    name: 'Golden Phoenix',
    title: 'Oltin Humo Qushi',
    category: 'Mythic',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-500 to-rose-500',
    iconSymbol: '🦅',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoldenPhoenix&backgroundColor=ffd5dc,ffdfbf',
    description: 'Xatolardan qayta yuksaluvchi tinimsiz iroda',
  },
  {
    id: 'avatar-cyber-scholar',
    name: 'Cyber Scholar',
    title: 'Kiber Olim',
    category: 'Sci-Fi',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-600',
    iconSymbol: '⚡',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberScholar&backgroundColor=c0aede,d1d4f9',
    description: 'Raqamli SAT algoritmlari va adaptiv test ustasi',
  },
  {
    id: 'avatar-desmos-wizard',
    name: 'Desmos Wizard',
    title: 'Grafik Sehrgari',
    category: 'Math Genius',
    accentColor: '#8B5CF6',
    bgGradient: 'from-purple-600 to-indigo-600',
    iconSymbol: '📐',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=DesmosWizard&backgroundColor=b6e3f4,ffd5dc',
    description: 'Har qanday tenglamani 10 soniyada grafikda yechuvchi dahosi',
  },
  {
    id: 'avatar-quantum-fox',
    name: 'Quantum Fox',
    title: 'Kvant Tulkisi',
    category: 'Sci-Fi',
    accentColor: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-600',
    iconSymbol: '🦊',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumFox&backgroundColor=ffd5dc,d1d4f9',
    description: 'Tuzoq savollarni bir zumda ilg\'ovchi o\'tkir zehn',
  },
  {
    id: 'avatar-centurion-knight',
    name: 'Centurion Knight',
    title: '1500+ Ritsari',
    category: 'Mythic',
    accentColor: '#EAB308',
    bgGradient: 'from-yellow-500 to-amber-600',
    iconSymbol: '🛡️',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CenturionKnight&backgroundColor=ffdfbf,ffd5dc',
    description: '100 kunlik uzluksiz o\'qish seriyasi qahramoni',
  },
  {
    id: 'avatar-cosmic-astronaut',
    name: 'Astro Pioneer',
    title: 'Koinot Fazogiri',
    category: 'Cosmic',
    accentColor: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-600',
    iconSymbol: '🚀',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstroPioneer&backgroundColor=b6e3f4,c0aede',
    description: 'Top Ivy League universitetlari sari dadil parvoz',
  },
  {
    id: 'avatar-zen-master',
    name: 'Mindful Sage',
    title: 'Zakovat Ustasi',
    category: 'Math Genius',
    accentColor: '#14B8A6',
    bgGradient: 'from-teal-500 to-emerald-600',
    iconSymbol: '🧘',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MindfulSage&backgroundColor=c0aede,ffd5dc',
    description: 'Imtihon paytida sovuqqonlik va 100% diqqat timsoli',
  },
  {
    id: 'avatar-stellar-dragon',
    name: 'Stellar Dragon',
    title: 'Yulduz Ajdari',
    category: 'Mythic',
    accentColor: '#EF4444',
    bgGradient: 'from-red-500 to-orange-600',
    iconSymbol: '🐉',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=StellarDragon&backgroundColor=ffd5dc,ffdfbf',
    description: '1600 ballik eng yuqori cho\'qqilarni zabt etuvchi kuch',
  },
  {
    id: 'avatar-neon-cyborg',
    name: 'Matrix Analyst',
    title: 'Matritsa Tahlilchisi',
    category: 'Sci-Fi',
    accentColor: '#6366F1',
    bgGradient: 'from-indigo-500 to-purple-600',
    iconSymbol: '🤖',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=MatrixAnalyst&backgroundColor=b6e3f4,d1d4f9',
    description: 'Har qanday grammatika va mantiqiy tuzilmani algoritmlashtiruvchi',
  },
  {
    id: 'avatar-infinity-thinker',
    name: 'Infinity Thinker',
    title: 'Cheksizlik Mutafakkiri',
    category: 'Cosmic',
    accentColor: '#A855F7',
    bgGradient: 'from-purple-500 to-pink-600',
    iconSymbol: '🌌',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=InfinityThinker&backgroundColor=c0aede,b6e3f4',
    description: 'Cheksiz bilim va qat\'iy strategiya egasi',
  },
  {
    id: 'avatar-logic-titan',
    name: 'Logic Titan',
    title: 'Mantiq Titani',
    category: 'Math Genius',
    accentColor: '#2563EB',
    bgGradient: 'from-blue-600 to-cyan-600',
    iconSymbol: '🏛️',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=LogicTitan&backgroundColor=d1d4f9,ffdfbf',
    description: 'Murakkab tenglamalarni bir zumda parchalovchi qudrat',
  }
];

export const getAvatarUrlByIndex = (index: number): string => {
  if (!CREATIVE_AVATARS || CREATIVE_AVATARS.length === 0) {
    return 'https://api.dicebear.com/7.x/bottts/svg?seed=AuraStudent';
  }
  const safeIndex = Math.abs(index) % CREATIVE_AVATARS.length;
  return CREATIVE_AVATARS[safeIndex].url;
};

export const getDefaultCreativeAvatar = (username: string): string => {
  if (!CREATIVE_AVATARS || CREATIVE_AVATARS.length === 0) {
    return 'https://api.dicebear.com/7.x/bottts/svg?seed=AuraStudent';
  }
  const hash = (username || 'student').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selected = CREATIVE_AVATARS[hash % CREATIVE_AVATARS.length];
  return selected ? selected.url : CREATIVE_AVATARS[0].url;
};
