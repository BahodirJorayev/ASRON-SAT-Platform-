import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Send,
  Instagram,
  Youtube,
  Share2,
  Sparkles,
  Search,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { BlogArticle, SiteBrandingConfig, INITIAL_SITE_CONFIG } from '../data/blogAndBrandingData';

interface Props {
  articles: BlogArticle[];
  siteBranding?: SiteBrandingConfig;
  branding?: SiteBrandingConfig;
  onOpenAuthModal: (mode?: 'signin' | 'signup') => void;
  onOpenDiagnostic?: () => void;
  onBackToOverview?: () => void;
  onSelectArticle?: (article: BlogArticle) => void;
}

export const BlogView: React.FC<Props> = ({
  articles,
  siteBranding,
  branding,
  onOpenAuthModal,
  onOpenDiagnostic,
  onBackToOverview,
  onSelectArticle,
}) => {
  const activeBranding = siteBranding || branding || INITIAL_SITE_CONFIG;
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Math Strategy', 'Reading & Writing', 'Study Science'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeArticle = selectedArticle || null;

  return (
    <div className="space-y-12 py-8 px-4 sm:px-8 max-w-7xl mx-auto font-sans text-[#1C1917] animate-in fade-in duration-300">
      {/* Back Button if onBackToOverview provided */}
      {onBackToOverview && (
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>
      )}

      {/* Header & Social Media Links Hub */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#FFFFFF] to-[#F5F1E9] border border-[#E8E2D5] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E8E2D5] text-[#2563EB] text-xs font-bold shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{activeBranding?.brandName || 'AURA SAT'} • SAT Masterclass & Strategy Blog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
              Digital SAT Strategies, Guides & Updates
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              Curated breakdowns from 1580+ scoring instructors, official Desmos walkthroughs, and cognitive study methods.
            </p>
          </div>

          {/* Social Media Communities */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-3 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Official Social Channels</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Telegram */}
              <a
                href={activeBranding?.telegramUrl || 'https://t.me/AuraSatPrepBot'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-blue-50 hover:border-blue-300 border border-[#E8E2D5] text-xs font-semibold text-[#1C1917] transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-[11px] group-hover:text-[#2563EB]">Telegram</div>
                  <div className="text-[9px] text-[#78716C] truncate">{activeBranding?.telegramChannelName || '@AuraSatPrepBot'}</div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={activeBranding?.instagramUrl || 'https://instagram.com/aurasatprep'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-pink-50 hover:border-pink-300 border border-[#E8E2D5] text-xs font-semibold text-[#1C1917] transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-[11px] group-hover:text-rose-600">Instagram</div>
                  <div className="text-[9px] text-[#78716C] truncate">{activeBranding?.instagramHandle || '@aurasatprep'}</div>
                </div>
              </a>

              {/* YouTube */}
              <a
                href={activeBranding?.youtubeUrl || 'https://youtube.com/@aurasatprep'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-red-50 hover:border-red-300 border border-[#E8E2D5] text-xs font-semibold text-[#1C1917] transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-[11px] group-hover:text-red-600">YouTube</div>
                  <div className="text-[9px] text-[#78716C] truncate">{activeBranding?.youtubeChannelName || 'Aura SAT Prep'}</div>
                </div>
              </a>

              {/* TikTok */}
              <a
                href={activeBranding?.tiktokUrl || 'https://tiktok.com/@aurasatprep'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-100 hover:border-slate-400 border border-[#E8E2D5] text-xs font-semibold text-[#1C1917] transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="font-bold text-xs">Tik</span>
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-[11px] group-hover:text-black">TikTok</div>
                  <div className="text-[9px] text-[#78716C] truncate">{activeBranding?.tiktokHandle || '@aurasatprep'}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="pt-4 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedArticle(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#57534E] hover:bg-[#FAF7F2] border border-[#E8E2D5]'
                }`}
              >
                {cat === 'ALL' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, topics..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </section>

      {/* Selected Article Detail View (If an article is clicked) */}
      {activeArticle ? (
        <article className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8 animate-in fade-in">
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-[#78716C]">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold border border-blue-200">
                {activeArticle.category}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.publishedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight leading-tight">
              {activeArticle.title}
            </h1>

            <div className="flex items-center gap-3 pt-2">
              <img
                src={activeArticle.author.avatar}
                alt={activeArticle.author.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E8E2D5]"
              />
              <div>
                <div className="text-xs font-bold text-[#1C1917]">{activeArticle.author.name}</div>
                <div className="text-[10px] text-[#78716C]">{activeArticle.author.role}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden max-h-96 border border-[#E8E2D5]">
            <img
              src={activeArticle.coverImage}
              alt={activeArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none text-sm text-[#383533] leading-relaxed space-y-4 whitespace-pre-line border-t border-[#E8E2D5] pt-6 font-sans">
            {activeArticle.contentMarkdown}
          </div>

          {/* Social CTA in Article */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#1C1917]">Join {activeBranding?.brandName || 'AURA SAT'} Discussion Community</div>
              <div className="text-[11px] text-[#78716C]">Get free daily mock questions and live audio reviews with {activeArticle.author.name}.</div>
            </div>
            <a
              href={activeBranding?.telegramUrl || 'https://t.me/AuraSatPrepBot'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Telegram Group</span>
            </a>
          </div>
        </article>
      ) : (
        /* Blog Grid List */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden border border-[#E8E2D5] relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md text-[10px] font-bold text-[#2563EB] border border-[#E8E2D5]">
                    {article.category}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#78716C]">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.publishedDate}</span>
                </div>

                <h3 className="font-bold text-base text-[#1C1917] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#57534E] line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-[11px] font-semibold text-[#57534E]">{article.author.name}</span>
                </div>

                <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Banner */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-extrabold">Never Miss a Strategy Breakdown</h2>
          <p className="text-xs text-blue-100 max-w-lg">
            Connect directly with {activeBranding?.brandName || 'AURA SAT'} instructors on Telegram and Instagram for weekly live study rooms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={activeBranding?.telegramUrl || 'https://t.me/AuraSatPrepBot'}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-white text-[#2563EB] font-bold text-xs shadow-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Telegram</span>
          </a>
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="px-5 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-xs border border-blue-400/40 transition-colors cursor-pointer"
          >
            Sign Up for Free
          </button>
        </div>
      </section>
    </div>
  );
};
