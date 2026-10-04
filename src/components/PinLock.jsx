import React, { useState, useEffect } from 'react';
import { Lock, Delete, ShieldCheck } from 'lucide-react';

export default function PinLock({ correctPin, onUnlock, theme = 'dark' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const isDark = theme === 'dark';

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setTimeout(() => {
            onUnlock();
          }, 150);
        } else {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className={`w-full max-w-sm rounded-3xl p-7 shadow-2xl border text-center flex flex-col items-center transition-all ${
        isDark 
          ? 'bg-slate-900/95 backdrop-blur-xl border-slate-800 text-white shadow-black/60' 
          : 'bg-white/95 backdrop-blur-xl border-gray-100 text-gray-800 shadow-2xl'
      }`}>
        
        {/* Discreet Minimalist Lock Badge (No names, no relationship cues) */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner mb-4 ${
          isDark ? 'bg-slate-800 text-indigo-400' : 'bg-slate-100 text-slate-700'
        }`}>
          <Lock className="w-7 h-7" />
        </div>

        <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Secure Passcode
        </h2>
        <p className={`text-xs mt-1 mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Enter 4-digit PIN to unlock
        </p>

        {/* 4 Pin Indicator Dots */}
        <div className={`flex items-center justify-center gap-4 mb-7 ${error ? 'animate-bounce text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-red-500 scale-110 shadow-sm shadow-red-300'
                    : isFilled
                    ? isDark 
                      ? 'bg-indigo-400 scale-125 shadow-md shadow-indigo-500/50' 
                      : 'bg-slate-800 scale-125 shadow-md shadow-slate-400'
                    : isDark 
                      ? 'bg-slate-800 border border-slate-700' 
                      : 'bg-gray-200 border border-gray-300'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold mb-3 -mt-3 animate-pulse">
            Incorrect PIN
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className={`h-14 rounded-2xl font-bold text-xl shadow-xs border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white border-slate-700' 
                  : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 border-gray-200/60'
              }`}
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {/* Blank space */}
          </div>
          <button
            onClick={() => handleKeyPress('0')}
            className={`h-14 rounded-2xl font-bold text-xl shadow-xs border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
              isDark 
                ? 'bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white border-slate-700' 
                : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 border-gray-200/60'
            }`}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className={`h-14 rounded-2xl font-bold text-base shadow-xs border transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
              isDark 
                ? 'bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-slate-300 border-slate-700' 
                : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 border-gray-200/60'
            }`}
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Discreet Hint: Just "Hint: Anniversary" */}
        <button
          onClick={() => setShowHint(!showHint)}
          className={`text-[11px] underline transition-colors cursor-pointer mt-2 ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          {showHint ? "Hint: Anniversary" : "Forgot PIN?"}
        </button>

        <div className={`mt-4 flex items-center gap-1 text-[10px] font-medium ${
          isDark ? 'text-slate-500' : 'text-gray-400'
        }`}>
          <ShieldCheck className="w-3 h-3 text-slate-500" />
          <span>Device Protected</span>
        </div>
      </div>
    </div>
  );
}
