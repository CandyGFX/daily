import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, X } from 'lucide-react';

export default function SurpriseModal({ isUnlocked, theme = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Only trigger once when unlocked and not seen yet
    const hasSeen = localStorage.getItem('ponnu_surprise_seen');
    if (isUnlocked && !hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Romantic celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#fb7185', '#fcd34d', '#ffffff']
          });
        } catch (e) {}
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isUnlocked]);

  const handleClose = () => {
    localStorage.setItem('ponnu_surprise_seen', 'true');
    setIsOpen(false);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#f43f5e', '#ffffff']
      });
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      <div className={`relative max-w-sm w-full rounded-3xl p-6 sm:p-7 text-center shadow-2xl border transition-all duration-300 transform scale-100 ${
        isDark 
          ? 'bg-slate-900/95 border-rose-500/40 text-white shadow-rose-950/60' 
          : 'bg-white/95 border-rose-200 text-gray-800 shadow-rose-200/80'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Floating Heart Icon Badge */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-xl shadow-rose-500/40 mb-4 animate-bounce">
          <div className="relative">
            <Heart className="w-10 h-10 fill-current animate-pulse-slow text-white" />
            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 absolute -top-1 -right-2 animate-spin" />
          </div>
        </div>

        {/* Cute Surprise Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-3 bg-rose-500/15 text-rose-500 border border-rose-500/30">
          <Sparkles className="w-3 h-3 text-rose-500" />
          <span>A Surprise Note For You 💕</span>
        </div>

        {/* The Exact User-Requested Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 leading-snug">
          Ponnuoooo... <br />
          I Loveee Youuu Sooo Much! 💖
        </h2>

        {/* Sweet Heartfelt Message */}
        <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${
          isDark ? 'text-slate-300' : 'text-gray-600'
        }`}>
          You are the most precious gift and blessing in my life. Every single day with you is my favorite day. Forever and always, yours. 🥰
        </p>

        {/* Big Romantic Button */}
        <button
          type="button"
          onClick={handleClose}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-500/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
          <span>I Love You Too, Irfan! 💕</span>
        </button>

        <p className={`text-[10px] mt-3 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
          With all my love & prayers 🤲
        </p>
      </div>
    </div>
  );
}
