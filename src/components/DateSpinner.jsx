import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Compass, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { DATE_IDEAS } from '../data/quotes';

export default function DateSpinner() {
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
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700 mb-3">
        <Compass className="w-3.5 h-3.5" />
        <span>Date Night Generator</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-2">
        Can't Decide What to Do?
      </h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
        Spin the couple wheel to discover tonight's romantic date adventure.
      </p>

      {/* Date Idea Card */}
      <div className="bg-white rounded-3xl p-8 border-2 border-rose-200/70 shadow-xl shadow-rose-100/50 relative overflow-hidden mb-6">
        <div className="w-16 h-16 rounded-full bg-linear-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-rose-200">
          <Sparkles className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
        </div>

        <p className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-2">
          Tonight's Date Plan
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug min-h-[64px] flex items-center justify-center">
          {selectedIdea}
        </h3>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinForIdea}
        disabled={isSpinning}
        className="bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-rose-300 transition-all transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? "Picking a Date..." : "Spin for New Date Idea 🎡"}</span>
      </button>

      {/* All Ideas List Preview */}
      <div className="mt-12 text-left bg-white/70 backdrop-blur-xs rounded-2xl p-5 border border-rose-100">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          More Cute Date Ideas on the List
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          {DATE_IDEAS.slice(0, 8).map((idea, idx) => (
            <div key={idx} className="p-2 bg-rose-50/50 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{idea}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
