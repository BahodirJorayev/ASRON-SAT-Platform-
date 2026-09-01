import React, { useState, useEffect } from 'react';
import { X, Star, Sparkles, Send, CheckCircle2, User as UserIcon, GraduationCap, Award } from 'lucide-react';
import { UserTestimonial } from '../data/blogAndBrandingData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (testimonial: UserTestimonial) => void;
}

export const ReviewSubmissionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [name, setName] = useState('');
  const [targetSchoolOrMajor, setTargetSchoolOrMajor] = useState('');
  const [score, setScore] = useState('');
  const [quote, setQuote] = useState('');
  const [stars, setStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return;

    const newReview: UserTestimonial = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      targetSchoolOrMajor: targetSchoolOrMajor.trim() || 'SAT Student',
      score: score.trim() || '1500+ Target',
      quote: quote.trim(),
      stars,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + (stars * 1000)}?w=150`,
      date: 'Hozirgina',
      verified: true,
    };

    onSubmitReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1600);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 font-sans overflow-y-auto overscroll-contain"
    >
      <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-[#1C1917] relative max-h-[90vh] sm:max-h-[86vh] my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer z-20 border border-[#E8E2D5]"
          title="Yopish (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E2D5] text-center space-y-1 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-amber-500/20">
            <Star className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
            O'z Fikringiz & Natijangizni Qoldiring
          </h2>
          <p className="text-xs text-[#78716C] max-w-xs mx-auto">
            AURA SAT platformasi orqali erishgan natijangiz, SAT balingiz va tajribangiz bilan boshqa talabalarga ilhom bering!
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-4 bg-[#FAF7F2]">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-bold text-base text-[#1C1917]">Katta rahmat!</h3>
              <p className="text-xs text-[#78716C]">
                Sharhingiz muvaffaqiyatli qabul qilindi va bosh sahifadagi Top 1% talabalar ro'yxatiga qo'shildi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Ismingiz va Familiyangiz *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Jasur Rahimov"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Universitet / Maktab
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={targetSchoolOrMajor}
                      onChange={(e) => setTargetSchoolOrMajor(e.target.value)}
                      placeholder="e.g. MIT / Harvard"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    SAT Bali / O'sish
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="e.g. 1560 (Math 800)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Bahoingiz (Yulduzcha)
                </label>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE]">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setStars(starVal)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= stars ? 'text-amber-500 fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#1C1917] ml-2">{stars} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Sharhingiz & Fikringiz *
                </label>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="AURA SAT platformasidagi qaysi imkoniyat (Desmos, AI Mistake Vault, Bluebook Mocks) sizga eng ko'p yordam berdi?"
                  required
                  className="w-full p-3 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Sharhni E'lon Qilish</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
