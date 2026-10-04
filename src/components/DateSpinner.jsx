import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Compass, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { DATE_IDEAS } from '../data/quotes';

export default function DateSpinner({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [selectedIdea, setSelectedIdea] = useState(DATE_IDEAS[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinForIdea = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * DATE_IDEAS.length);
      setSelectedIdea(DATE_IDEAS[randomIdx]);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 100);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
        isDark ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60' : 'bg-rose-100 text-rose-700'
      }`}>
        <Compass className="w-3.5 h-3.5" />
        <span>Date Night Generator</span>
      </div>

      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        Can't Decide What to Do?
      </h2>
      <p className={`text-sm max-w-md mx-auto mb-8 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
        Spin the couple wheel to discover tonight's romantic date adventure.
      </p>

      {/* Date Idea Card */}
      <div className={`rounded-3xl p-8 border shadow-xl relative overflow-hidden mb-6 transition-all ${
        isDark 
          ? 'bg-slate-900/85 backdrop-blur-xl border-slate-800 text-white shadow-indigo-950/60' 
          : 'bg-white border-2 border-rose-200/70 shadow-rose-100/50 text-gray-800'
      }`}>
        <div className={`w-16 h-16 rounded-full text-white flex items-center justify-center mx-auto mb-4 shadow-md ${
          isDark 
            ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-950' 
            : 'bg-linear-to-tr from-rose-500 to-pink-400 shadow-rose-200'
        }`}>
          <Sparkles className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
        </div>

        <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${
          isDark ? 'text-indigo-400' : 'text-rose-500'
        }`}>
          Tonight's Date Plan
        </p>

        <h3 className={`text-xl sm:text-2xl font-bold leading-snug min-h-[64px] flex items-center justify-center ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          {selectedIdea}
        </h3>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinForIdea}
        disabled={isSpinning}
        className={`text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-950/80' 
            : 'bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-rose-300'
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? "Picking a Date..." : "Spin for New Date Idea 🎡"}</span>
      </button>

      {/* All Ideas List Preview */}
      <div className={`mt-12 text-left backdrop-blur-xs rounded-2xl p-5 border transition-colors ${
        isDark 
          ? 'bg-slate-900/60 border-slate-800 text-slate-300' 
          : 'bg-white/70 border-rose-100 text-gray-700'
      }`}>
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
          isDark ? 'text-slate-300' : 'text-gray-700'
        }`}>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          More Halal & Wholesome Date Ideas
        </h4>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ${
          isDark ? 'text-slate-400' : 'text-gray-600'
        }`}>
          {DATE_IDEAS.slice(0, 8).map((idea, idx) => (
            <div key={idx} className={`p-2 rounded-lg flex items-center gap-2 ${
              isDark ? 'bg-slate-950/50 text-slate-300 border border-slate-800/60' : 'bg-rose-50/50 text-gray-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-indigo-400' : 'bg-rose-400'}`} />
              <span>{idea}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
