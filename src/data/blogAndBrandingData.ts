export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  coverImage: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  contentMarkdown: string;
}

export interface SiteBrandingConfig {
  brandName: string;
  brandTagline: string;
  logoIcon: string;
  logoBadgeYear: string;
  telegramUrl: string;
  telegramChannelName: string;
  instagramUrl: string;
  instagramHandle: string;
  youtubeUrl: string;
  youtubeChannelName: string;
  tiktokUrl: string;
  tiktokHandle: string;
  supportEmail: string;
  heroHeadline: string;
  heroSubtext: string;
  priceStandard: number;
  pricePro: number;
}

export interface UserTestimonial {
  id: string;
  name: string;
  targetSchoolOrMajor?: string;
  university?: string; // alias
  score: string | number; // e.g. "1580 (RW: 780, Math: 800)" or 1580
  quote: string;
  stars?: number;
  avatar?: string;
  avatarUrl?: string; // alias
  date?: string;
  verifiedDate?: string; // alias
  verified?: boolean;
}

export interface AdminCredentials {
  adminEmail: string;
  adminPass: string;
}

export const INITIAL_ADMIN_CREDENTIALS: AdminCredentials = {
  adminEmail: 'admin@asronsat.uz',
  adminPass: 'asron2026',
};

export const INITIAL_TESTIMONIALS: UserTestimonial[] = [];

export const INITIAL_SITE_CONFIG: SiteBrandingConfig = {
  brandName: 'ASRON SAT',
  brandTagline: 'Digital SAT Intelligence Platform',
  logoIcon: '▲',
  logoBadgeYear: '2026',
  telegramUrl: 'https://t.me/AsronSatBot',
  telegramChannelName: '@AsronSatBot',
  instagramUrl: 'https://instagram.com/asronsat',
  instagramHandle: '@asronsat',
  youtubeUrl: 'https://youtube.com/@asronsat',
  youtubeChannelName: 'ASRON SAT Official',
  tiktokUrl: 'https://tiktok.com/@asronsat',
  tiktokHandle: '@asronsat',
  supportEmail: 'contact@asronsat.uz',
  heroHeadline: 'Score 1500+ on the Digital SAT with Adaptive Mastery & AI',
  heroSubtext: '10-Minute daily workouts, authentic 2-stage multi-stage adaptive mocks, AI mistake cloned variations, and Desmos math suite built for serious high scorers.',
  priceStandard: 29,
  pricePro: 59,
};

export const INITIAL_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'desmos-secrets-sat-math-800',
    title: 'Top 7 Desmos Hacks to Guarantee an 800 on Digital SAT Math',
    excerpt: 'How to use regression, table lookup, and inequality shading inside the official built-in Desmos calculator to solve complex systems in under 20 seconds.',
    category: 'Math Strategy',
    readTime: '4 min read',
    publishedDate: 'Aug 28, 2026',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    tags: ['Desmos', 'Math 800', 'Calculators'],
    author: {
      name: 'ASRON SAT Math Department',
      role: 'Master SAT Math Team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    contentMarkdown: `### Master the Built-In Calculator
The Digital SAT provides the full-featured Desmos graphing calculator directly on every math question. Scoring an 800 is no longer about raw algebra by hand—it is about algorithmic efficiency:

1. **Regression Equations ($y_1 \\sim mx_1 + b$)**: Enter coordinates into a table and let Desmos solve polynomials and lines automatically.
2. **Finding Intersections Instantly**: Type both equations and click on the intersection points to find solutions.
3. **Inequality Shading**: Desmos automatically shades feasibility regions for systems of linear inequalities.
4. **Slider Optimization**: Use sliders to test coefficients $(a, b, c)$ when questions ask for unknown constant values.`,
  },
  {
    id: 'digital-sat-reading-transitions',
    title: 'Words in Context & Transitions: The 3 Rules You Must Know',
    excerpt: 'Stop memorizing 5,000 obscure flashcards. The Digital SAT tests vocabulary strictly through contextual tone and structural logical connectors.',
    category: 'Reading & Writing',
    readTime: '5 min read',
    publishedDate: 'Aug 25, 2026',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    tags: ['Reading', 'Vocabulary', 'Grammar'],
    author: {
      name: 'ASRON SAT Verbal Team',
      role: 'Head of Verbal Strategy',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    contentMarkdown: `### 3 Golden Rules for Digital SAT Transitions
1. **Directional Signposts**: Identify whether the subsequent clause agrees (*Furthermore, Therefore, Consequently*), contrasts (*However, Nevertheless, Conversely*), or exemplifies (*For instance, Specifically*).
2. **Eliminate Identical Synonyms**: If both "Therefore" and "Consequently" appear in the options, both are usually incorrect because they serve the exact same syntactic role.
3. **Punctuation Boundaries**: Semicolons and periods have identical structural weight on the Digital SAT.`,
  },
  {
    id: 'leitner-system-mistake-mastery',
    title: 'How Leitner Spaced Repetition Solves the "Stuck at 1350" Plateau',
    excerpt: 'Why doing hundreds of random practice tests fails, and how reviewing cloned variations on Day 3, 7, and 21 guarantees permanent cognitive retention.',
    category: 'Study Science',
    readTime: '6 min read',
    publishedDate: 'Aug 20, 2026',
    coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
    tags: ['Cognitive Science', 'Spaced Repetition', 'Mistake Vault'],
    author: {
      name: 'ASRON SAT Research Team',
      role: 'Curriculum & Psychometrics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    contentMarkdown: `### The Science of Spaced Retrieval
Most students plateau at 1350 because they review an explanation once, nod along, and never see the question again. Two weeks later, the exact same trap catches them on the official exam.

The **Leitner 3-Stage Method**:
* **Stage 1 (Day 3)**: Retest the exact concept with cloned values.
* **Stage 2 (Day 7)**: Solve a harder variation requiring multi-step synthesis.
* **Stage 3 (Day 21)**: Final mastery verification. Once cleared, your error rate on that sub-skill drops below 1.5%.`,
  },
];
