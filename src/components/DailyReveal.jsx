import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Sparkles, Calendar, MapPin, RefreshCw, 
  Share2, Eye, Flame, Clock, Award
} from 'lucide-react';

export default function DailyReveal({ 
  memories, 
  quotes, 
  startDate, 
  coupleNames, 
  onOpenUpload 
}) {
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
      <div className="w-full bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-200 mb-8 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-pink-300/20 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Our Journey in Love</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
            {coupleNames || "Irfan & Shahana"}
          </h2>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full text-center">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.days}</span>
              <span className="text-[10px] sm:text-xs text-rose-100 uppercase tracking-wider font-semibold">Days</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.hours}</span>
              <span className="text-[10px] sm:text-xs text-rose-100 uppercase tracking-wider font-semibold">Hours</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.minutes}</span>
              <span className="text-[10px] sm:text-xs text-rose-100 uppercase tracking-wider font-semibold">Mins</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-black">{timeTogether.seconds}</span>
              <span className="text-[10px] sm:text-xs text-rose-100 uppercase tracking-wider font-semibold">Secs</span>
            </div>
          </div>

          <p className="text-xs text-rose-100 mt-3 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-rose-200" />
            Every single second spent with you is a treasure.
          </p>
        </div>
      </div>

      {/* Daily Reveal Section */}
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700 mb-2">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Today's Love Note & Photo
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isOpened 
              ? "Here is your moment and love quote for today!" 
              : "Tap the sealed envelope to open today's surprise 💕"}
          </p>
        </div>

        {/* Sealed Envelope State */}
        {!isOpened ? (
          <div 
            onClick={handleOpenReveal}
            className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-dashed border-rose-200 hover:border-rose-400 shadow-xl shadow-rose-100 hover:shadow-2xl transition-all cursor-pointer group flex flex-col items-center text-center transform hover:-translate-y-1"
          >
            <div className="w-24 h-24 rounded-full bg-linear-to-tr from-rose-100 to-pink-100 border-4 border-white shadow-inner flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <div className="relative">
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse-slow" />
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400 absolute -top-1 -right-2 animate-bounce" />
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-1">
              Private Love Note
            </span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              For My Favorite Person
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mb-6">
              A special photo memory and a heartfelt quote waiting just for you today.
            </p>

            <button 
              type="button"
              className="bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md shadow-rose-200 group-hover:shadow-rose-300 flex items-center gap-2 group-hover:scale-105 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Tap to Open Today's Letter</span>
            </button>
          </div>
        ) : (
          /* Opened Daily Card State */
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl shadow-rose-200/50 border border-rose-100 transition-all animate-fadeIn">
            {/* Flashback Banner if applicable */}
            {isFlashback && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-amber-800 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-600" />
                <span>On This Day Flashback: Look how far our love has traveled!</span>
              </div>
            )}

            {/* Polaroid Photo Frame */}
            <div className="bg-neutral-50 p-3 sm:p-4 rounded-2xl shadow-sm border border-neutral-200/70 mb-5 relative group">
              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-rose-50 relative">
                {currentMemory ? (
                  <img
                    src={currentMemory.imageUrl}
                    alt={currentMemory.caption || "Couple memory"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                    <Heart className="w-12 h-12 text-rose-200 mb-2" />
                    <p className="text-sm font-medium">No photo uploaded yet!</p>
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
              <div className="pt-3 px-1 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  {currentMemory?.date || dateStr}
                </span>
                {currentMemory?.location && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {currentMemory.location}
                  </span>
                )}
              </div>
              {currentMemory?.caption && (
                <p className="text-xs sm:text-sm text-gray-700 font-medium italic mt-1 px-1">
                  "{currentMemory.caption}"
                </p>
              )}
            </div>

            {/* Daily Quote Box */}
            <div className="bg-linear-to-br from-rose-50/80 to-pink-50/50 rounded-2xl p-5 border border-rose-100 text-center relative mb-5">
              <div className="inline-block p-1 bg-white rounded-full text-rose-500 shadow-xs mb-2">
                <Heart className="w-4 h-4 fill-current text-rose-500" />
              </div>
              <blockquote className="text-base sm:text-lg font-serif italic text-gray-800 leading-relaxed">
                "{activeQuote?.quote || currentMemory?.quote || "I love you more than yesterday, but less than tomorrow."}"
              </blockquote>
              <div className="mt-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
                — {activeQuote?.author || coupleNames || "Yours Forever"}
              </div>
              {activeQuote?.mood && (
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-rose-200/50 text-rose-700 rounded-full">
                  Mood: {activeQuote.mood}
                </span>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-rose-100">
              <button
                onClick={handleNextQuote}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 px-3.5 py-2 rounded-full border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer"
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
