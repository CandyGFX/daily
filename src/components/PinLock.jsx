import React, { useState, useEffect } from 'react';
import { Heart, Lock, Delete, Sparkles, ShieldCheck } from 'lucide-react';

export default function PinLock({ correctPin, onUnlock, coupleNames }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          // Success!
          setTimeout(() => {
            onUnlock();
          }, 150);
        } else {
          // Shake error
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 700);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  // Keyboard support (typing 0-9, Backspace)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, correctPin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-linear-to-b from-rose-100/90 via-pink-50/95 to-rose-200/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl p-7 shadow-2xl border border-white/60 text-center flex flex-col items-center">
        
        {/* Animated Heart / Lock Badge */}
        <div className="w-20 h-20 rounded-full bg-linear-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-300/50 mb-4 animate-float">
          <div className="relative">
            <Heart className="w-10 h-10 fill-current" />
            <Lock className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
          <span>{coupleNames || "Irfan & Shahana"}</span>
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
        </h2>
        <p className="text-xs text-rose-500 font-semibold mt-0.5">
          Private Couple Vault
        </p>

        <p className="text-xs text-gray-500 mt-2 mb-6">
          Enter your 4-digit secret PIN to open our memories
        </p>

        {/* 4 Pin Indicator Dots */}
        <div className={`flex items-center justify-center gap-4 mb-7 ${error ? 'animate-bounce text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-red-500 scale-110 shadow-sm shadow-red-300'
                    : isFilled
                    ? 'bg-rose-500 scale-125 shadow-md shadow-rose-300'
                    : 'bg-gray-200 border border-gray-300'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold mb-3 -mt-3 animate-pulse">
            Incorrect PIN, try again!
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-14 rounded-2xl bg-rose-50/70 hover:bg-rose-100 active:bg-rose-200 text-gray-800 font-bold text-xl shadow-xs border border-rose-100/60 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {/* Blank placeholder */}
          </div>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-rose-50/70 hover:bg-rose-100 active:bg-rose-200 text-gray-800 font-bold text-xl shadow-xs border border-rose-100/60 transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-rose-50/70 hover:bg-rose-100 active:bg-rose-200 text-gray-600 font-bold text-base shadow-xs border border-rose-100/60 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Hint toggle */}
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-[11px] text-gray-400 hover:text-rose-500 underline transition-colors cursor-pointer mt-2"
        >
          {showHint ? `Default PIN: ${correctPin} (Anniversary: March 23)` : "Need a hint?"}
        </button>

        <div className="mt-4 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Encrypted on device for privacy</span>
        </div>
      </div>
    </div>
  );
}
