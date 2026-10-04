import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Sparkles, Calendar, MapPin, RefreshCw, 
  Share2, Eye, Flame, Clock, Award, Edit3 
} from 'lucide-react';

export default function DailyReveal({ 
  memories, 
  quotes, 
  startDate, 
  coupleNames, 
  onOpenUpload,
  onOpenEdit,
  theme = 'dark'
}) {
  const isDark = theme === 'dark';
  const [isOpened, setIsOpened] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);

  // Calculate live relationship duration
  useEffect(() => {
    function updateTimer() {
      const start = new Date(startDate || '2026-03-23T00:00:00');
      const now = new Date();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeTogether({ days, hours, minutes, seconds });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  // Deterministic daily photo and quote calculation based on today's calendar date
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );

  const activeMemories = memories && memories.length > 0 ? memories : [];
  const dailyMemoryIndex = activeMemories.length > 0 ? (dayOfYear % activeMemories.length) : 0;
  const currentMemory = activeMemories[dailyMemoryIndex];

  // Set initial daily quote index
  useEffect(() => {
    if (quotes && quotes.length > 0) {
      setCurrentQuoteIndex(dayOfYear % quotes.length);
    }
  }, [quotes, dayOfYear]);

  const activeQuote = quotes && quotes.length > 0 ? quotes[currentQuoteIndex] : null;

  // Check if today's memory is an "On this day" flashback
  const isFlashback = currentMemory && currentMemory.date && (() => {
    const memDate = new Date(currentMemory.date);
    return (
      memDate.getMonth() === today.getMonth() &&
      memDate.getDate() === today.getDate() &&
      memDate.getFullYear() < today.getFullYear()
    );
  })();

  const handleOpenReveal = () => {
    setIsOpened(true);
    // Fire romantic confetti!
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#ffedd5']
    });
  };

  const handleNextQuote = () => {
    if (quotes && quotes.length > 0) {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }
  };

  const handleShare = () => {
    if (navigator.share && currentMemory) {
      navigator.share({
        title: `${coupleNames} - Daily Love Note`,
        text: `"${activeQuote?.quote || currentMemory.quote}" - Thinking of us today 💕`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `"${activeQuote?.quote || currentMemory?.quote || ''}" - ${coupleNames || 'Our Love Story'}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Milestone Counter Banner */}
      <div className={`w-full rounded-3xl p-6 text-white mb-8 relative overflow-hidden transition-all duration-500 ${
        isDark
          ? 'bg-gradient-to-r from-indigo-950/95 via-purple-950/90 to-slate-950/95 border border-indigo-700/40 shadow-2xl shadow-indigo-950/70 backdrop-blur-xl'
          : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-200'
      }`}>
        {/* Decorative background circles */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-xl pointer-events-none ${
          isDark ? 'bg-indigo-500/15' : 'bg-white/10'
        }`} />
        <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-lg pointer-events-none ${
          isDark ? 'bg-purple-500/20' : 'bg-pink-300/20'
        }`} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-3 ${
            isDark ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/50' : 'bg-white/20 text-white backdrop-blur-md'
          }`}>
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Our Journey in Love</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
            {coupleNames || "Irfan & Shahana"}
          </h2>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full text-center">
            <div className={`backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-white/15 border-white/20'
            }`}>
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.days}</span>
              <span className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'text-indigo-200' : 'text-rose-100'
              }`}>Days</span>
            </div>
            <div className={`backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-white/15 border-white/20'
            }`}>
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.hours}</span>
              <span className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'text-indigo-200' : 'text-rose-100'
              }`}>Hours</span>
            </div>
            <div className={`backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-white/15 border-white/20'
            }`}>
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.minutes}</span>
              <span className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'text-indigo-200' : 'text-rose-100'
              }`}>Mins</span>
            </div>
            <div className={`backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border ${
              isDark ? 'bg-white/10 border-white/15' : 'bg-white/15 border-white/20'
            }`}>
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.seconds}</span>
              <span className={`text-[10px] sm:text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'text-indigo-200' : 'text-rose-100'
              }`}>Secs</span>
            </div>
          </div>

          <p className={`text-xs mt-3 font-medium flex items-center gap-1 ${
            isDark ? 'text-indigo-200' : 'text-rose-100'
          }`}>
            <Clock className={`w-3 h-3 ${isDark ? 'text-indigo-300' : 'text-rose-200'}`} />
            Every single second spent with you is a treasure.
          </p>
        </div>
      </div>

      {/* Daily Reveal Section */}
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
            isDark ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60' : 'bg-rose-100 text-rose-700'
          }`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {today.toLocaleDateString(undefined, { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Today's Love Note & Photo
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {isOpened 
              ? "Here is your moment and love quote for today!" 
              : "Tap the sealed envelope to open today's surprise 💕"}
          </p>
        </div>

        {/* Sealed Envelope State */}
        {!isOpened ? (
          <div 
            onClick={handleOpenReveal}
            className={`w-full max-w-md rounded-3xl p-8 border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center text-center transform hover:-translate-y-1 ${
              isDark 
                ? 'bg-slate-900/85 backdrop-blur-xl border-slate-700/80 hover:border-indigo-400 shadow-2xl shadow-indigo-950/40' 
                : 'bg-white border-rose-200 hover:border-rose-400 shadow-xl shadow-rose-100 hover:shadow-2xl'
            }`}
          >
            <div className={`w-24 h-24 rounded-full border-4 shadow-inner flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${
              isDark 
                ? 'bg-gradient-to-tr from-indigo-950 to-slate-900 border-slate-800 shadow-black/50' 
                : 'bg-linear-to-tr from-rose-100 to-pink-100 border-white'
            }`}>
              <div className="relative">
                <Heart className={`w-12 h-12 animate-pulse-slow ${
                  isDark ? 'text-indigo-400 fill-indigo-400' : 'text-rose-500 fill-rose-500'
                }`} />
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400 absolute -top-1 -right-2 animate-bounce" />
              </div>
            </div>

            <span className={`text-xs uppercase tracking-widest font-bold mb-1 ${
              isDark ? 'text-indigo-400' : 'text-rose-500'
            }`}>
              Private Love Note
            </span>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              For My Favorite Person
            </h3>
            <p className={`text-sm max-w-xs mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              A special photo memory and a heartfelt quote waiting just for you today.
            </p>

            <button 
              type="button"
              className={`text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md flex items-center gap-2 group-hover:scale-105 transition-all ${
                isDark 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-900/50 hover:from-indigo-500 hover:to-purple-500' 
                  : 'bg-linear-to-r from-rose-500 to-pink-500 shadow-rose-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Tap to Open Today's Letter</span>
            </button>
          </div>
        ) : (
          /* Opened Daily Card State */
          <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl transition-all animate-fadeIn border ${
            isDark 
              ? 'bg-slate-900/90 backdrop-blur-xl border-slate-800 shadow-indigo-950/60 text-white' 
              : 'bg-white border-rose-100 shadow-rose-200/50 text-gray-800'
          }`}>
            {/* Flashback Banner if applicable */}
            {isFlashback && (
              <div className={`mb-4 border rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs font-semibold ${
                isDark 
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <Award className="w-4 h-4 text-amber-400" />
                <span>On This Day Flashback: Look how far our love has traveled!</span>
              </div>
            )}

            {/* Polaroid Photo Frame */}
            <div className={`p-3 sm:p-4 rounded-2xl shadow-sm border mb-5 relative group ${
              isDark 
                ? 'bg-slate-950/80 border-slate-800' 
                : 'bg-neutral-50 border-neutral-200/70'
            }`}>
              <div className={`aspect-4/3 w-full rounded-xl overflow-hidden relative ${
                isDark ? 'bg-slate-900' : 'bg-rose-50'
              }`}>
                {currentMemory ? (
                  <img
                    src={currentMemory.imageUrl}
                    alt={currentMemory.caption || "Couple memory"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <Heart className={`w-12 h-12 mb-2 ${isDark ? 'text-indigo-400/40' : 'text-rose-200'}`} />
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>No photo uploaded yet!</p>
                    <button
                      onClick={onOpenUpload}
                      className="mt-3 text-xs bg-rose-500 text-white px-3 py-1.5 rounded-full"
                    >
                      Upload First Memory
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Caption & Metadata */}
              <div className={`pt-3 px-1 flex items-center justify-between text-xs font-medium ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  {currentMemory?.date || dateStr}
                </span>
                <div className="flex items-center gap-2">
                  {currentMemory?.location && (
                    <span className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {currentMemory.location}
                    </span>
                  )}
                  {currentMemory && onOpenEdit && (
                    <button
                      onClick={() => onOpenEdit(currentMemory)}
                      className={`p-1 px-2 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                        isDark 
                          ? 'text-indigo-300 hover:text-white bg-slate-800/80 hover:bg-slate-700' 
                          : 'text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100'
                      }`}
                      title="Edit caption & details"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Caption</span>
                    </button>
                  )}
                </div>
              </div>
              {currentMemory?.caption ? (
                <p className={`text-xs sm:text-sm font-medium italic mt-1 px-1 ${
                  isDark ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  "{currentMemory.caption}"
                </p>
              ) : currentMemory ? (
                <p 
                  onClick={() => onOpenEdit && onOpenEdit(currentMemory)}
                  className={`text-xs italic mt-1 px-1 cursor-pointer transition-colors ${
                    isDark ? 'text-slate-500 hover:text-indigo-400' : 'text-gray-400 hover:text-rose-500'
                  }`}
                >
                  + Add a caption to today's memory...
                </p>
              ) : null}
            </div>

            {/* Daily Quote Box */}
            <div className={`rounded-2xl p-5 border text-center relative mb-5 ${
              isDark 
                ? 'bg-slate-950/60 border-slate-800 text-slate-100' 
                : 'bg-linear-to-br from-rose-50/80 to-pink-50/50 border-rose-100 text-gray-800'
            }`}>
              <div className={`inline-block p-1 rounded-full shadow-xs mb-2 ${
                isDark ? 'bg-slate-800 text-rose-400' : 'bg-white text-rose-500'
              }`}>
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <blockquote className={`text-base sm:text-lg font-serif italic leading-relaxed ${
                isDark ? 'text-slate-100' : 'text-gray-800'
              }`}>
                "{activeQuote?.quote || currentMemory?.quote || "I love you more than yesterday, but less than tomorrow."}"
              </blockquote>
              <div className={`mt-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 ${
                isDark ? 'text-indigo-300' : 'text-rose-500'
              }`}>
                <span>With All My Heart 💕</span>
              </div>
              {activeQuote?.mood && (
                <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-indigo-900/60 text-indigo-300' : 'bg-rose-200/50 text-rose-700'
                }`}>
                  Mood: {activeQuote.mood}
                </span>
              )}
            </div>

            {/* Action Bar */}
            <div className={`flex items-center justify-between gap-2 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-rose-100'
            }`}>
              <button
                onClick={handleNextQuote}
                className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
                  isDark 
                    ? 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700' 
                    : 'text-gray-600 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 border-gray-200 hover:border-rose-200'
                }`}
                title="Shuffle another romantic quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Another Quote</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-rose-200 transition-all cursor-pointer font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied! 💕" : "Send to Love"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
