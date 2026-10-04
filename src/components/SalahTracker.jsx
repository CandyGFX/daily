import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Circle, Sparkles, Heart, 
  ChevronLeft, ChevronRight, Calendar, ShieldCheck,
  Sunrise, Sun, Sunset, Moon, Star
} from 'lucide-react';
import { subscribeToSalah, syncSaveSalah } from '../utils/firebase';

const SALAH_LIST = [
  { id: 'fajr', name: 'Fajr', arabic: 'الفجر', desc: 'Dawn Prayer', icon: Sunrise, color: 'text-amber-400' },
  { id: 'dhuhr', name: 'Dhuhr', arabic: 'الظهر', desc: 'Noon Prayer', icon: Sun, color: 'text-yellow-400' },
  { id: 'asr', name: 'Asr', arabic: 'العصر', desc: 'Afternoon Prayer', icon: Sun, color: 'text-orange-400' },
  { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب', desc: 'Sunset Prayer', icon: Sunset, color: 'text-rose-400' },
  { id: 'isha', name: 'Isha', arabic: 'العشاء', desc: 'Night Prayer', icon: Moon, color: 'text-indigo-400' },
];

const SPIRITUAL_REMINDERS = [
  "“Our Lord, grant us from among our spouses comfort to our eyes and make us an example for the righteous.” (Quran 25:74)",
  "“The best of you are those who are best to their families.” (Prophet Muhammad ﷺ)",
  "When a husband and wife look at each other with love, Allah looks at both of them with mercy.",
  "A home where Salah is established is filled with peace, angels, and divine Barakah.",
  "“And whoever relies upon Allah — then He is sufficient for him.” (Quran 65:3)"
];

export default function SalahTracker({ coupleNames = 'Irfan & Shahana', theme = 'dark' }) {
  const isDark = theme === 'dark';

  // Parse couple names into partner 1 and partner 2
  const nameParts = coupleNames.split('&').map(s => s.trim());
  const partner1Name = nameParts[0] || 'Irfan';
  const partner2Name = nameParts[1] || 'Shahana';

  // Date management (defaults to today in local YYYY-MM-DD format)
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentDateStr, setCurrentDateStr] = useState(getTodayStr);

  // Salah completion state: { irfan: { fajr: bool, ... }, shahana: { fajr: bool, ... } }
  const [salahState, setSalahState] = useState(() => {
    const saved = localStorage.getItem(`salah_${currentDateStr}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      partner1: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      partner2: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
    };
  });

  // Real-time synchronization via Firebase Firestore
  useEffect(() => {
    // 1. Check local storage first
    const saved = localStorage.getItem(`salah_${currentDateStr}`);
    if (saved) {
      try { setSalahState(JSON.parse(saved)); } catch (e) {}
    } else {
      setSalahState({
        partner1: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
        partner2: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false }
      });
    }

    // 2. Real-time Firebase cloud listener for this date
    const unsubscribe = subscribeToSalah(currentDateStr, (cloudData) => {
      if (cloudData && (cloudData.partner1 || cloudData.partner2)) {
        const merged = {
          partner1: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, ...(cloudData.partner1 || {}) },
          partner2: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, ...(cloudData.partner2 || {}) }
        };
        setSalahState(merged);
        localStorage.setItem(`salah_${currentDateStr}`, JSON.stringify(merged));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentDateStr]);

  // Toggle prayer completion
  const handleTogglePrayer = async (partnerKey, prayerId) => {
    const updated = {
      ...salahState,
      [partnerKey]: {
        ...salahState[partnerKey],
        [prayerId]: !salahState[partnerKey]?.[prayerId]
      }
    };

    setSalahState(updated);
    localStorage.setItem(`salah_${currentDateStr}`, JSON.stringify(updated));

    // Save to Firebase so partner's phone updates in real-time
    await syncSaveSalah(currentDateStr, updated);

    // If all prayers completed for today, fire barakah confetti!
    const p1Count = Object.values(updated.partner1).filter(Boolean).length;
    const p2Count = Object.values(updated.partner2).filter(Boolean).length;
    if (p1Count === 5 && p2Count === 5) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#fcd34d', '#ffffff']
      });
    }
  };

  // Date Navigation
  const handlePrevDay = () => {
    const parts = currentDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setCurrentDateStr(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const parts = currentDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setCurrentDateStr(`${year}-${month}-${day}`);
  };

  const isToday = currentDateStr === getTodayStr();

  // Prayer counts
  const p1Completed = Object.values(salahState.partner1 || {}).filter(Boolean).length;
  const p2Completed = Object.values(salahState.partner2 || {}).filter(Boolean).length;
  const bothAllDone = p1Completed === 5 && p2Completed === 5;

  // Formatted date string for display
  const displayDate = (() => {
    const parts = currentDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  })();

  // Random daily reminder
  const reminderIndex = Math.abs(currentDateStr.split('-').reduce((acc, v) => acc + Number(v), 0)) % SPIRITUAL_REMINDERS.length;
  const dailyReminder = SPIRITUAL_REMINDERS[reminderIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1 rounded-full mb-2 ${
          isDark 
            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' 
            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Couple Daily Salah Tracker</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Our 5 Daily Prayers
        </h2>
        <p className={`text-xs sm:text-sm mt-1 max-w-md mx-auto ${
          isDark ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Growing closer to Allah, growing closer together in this life and the next.
        </p>
      </div>

      {/* Date Navigation Bar */}
      <div className={`flex items-center justify-between p-3 rounded-2xl border mb-6 transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white border-rose-100 text-gray-800 shadow-xs'
      }`}>
        <button
          onClick={handlePrevDay}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark 
              ? 'hover:bg-slate-800 border-slate-700 text-slate-300' 
              : 'hover:bg-rose-50 border-gray-200 text-gray-600'
          }`}
          title="Previous Day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-center">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {displayDate}
          </span>
          {isToday && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Today
            </span>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark 
              ? 'hover:bg-slate-800 border-slate-700 text-slate-300' 
              : 'hover:bg-rose-50 border-gray-200 text-gray-600'
          }`}
          title="Next Day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Couple Summary Card */}
      <div className={`p-4 sm:p-5 rounded-3xl border mb-6 relative overflow-hidden transition-all ${
        bothAllDone
          ? 'bg-gradient-to-r from-emerald-950/90 via-teal-950/85 to-slate-950/90 border-emerald-600/50 shadow-xl shadow-emerald-950/50 text-white'
          : isDark 
          ? 'bg-slate-900/85 border-slate-800 text-white shadow-xl shadow-black/40' 
          : 'bg-white border-emerald-100 text-gray-800 shadow-md shadow-emerald-100/40'
      }`}>
        <div className="flex items-center justify-between text-center gap-2">
          {/* Irfan's score */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-500">
              {partner1Name}
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${
              p1Completed === 5 ? 'text-emerald-400' : isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {p1Completed} <span className="text-xs text-gray-400 font-normal">/ 5</span>
            </div>
            <div className="w-full max-w-[90px] bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(p1Completed / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Center Heart / Mosque Icon */}
          <div className="px-3 flex flex-col items-center justify-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
              bothAllDone 
                ? 'bg-emerald-500 text-white animate-bounce' 
                : isDark 
                ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              {bothAllDone ? <Sparkles className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5 fill-current" />}
            </div>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">Together</span>
          </div>

          {/* Shahana's score */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-500">
              {partner2Name}
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${
              p2Completed === 5 ? 'text-emerald-400' : isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {p2Completed} <span className="text-xs text-gray-400 font-normal">/ 5</span>
            </div>
            <div className="w-full max-w-[90px] bg-gray-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(p2Completed / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {bothAllDone && (
          <div className="mt-4 pt-3 border-t border-emerald-500/30 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Masha'Allah! All 5 prayers completed by both of you today 🤲✨</span>
          </div>
        )}
      </div>

      {/* Both-Side Salah List */}
      <div className="space-y-3">
        {SALAH_LIST.map((salah) => {
          const Icon = salah.icon;
          const p1Done = !!salahState.partner1?.[salah.id];
          const p2Done = !!salahState.partner2?.[salah.id];

          return (
            <div
              key={salah.id}
              className={`rounded-2xl border p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 transition-all ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800/90 text-white' 
                  : 'bg-white border-gray-100 text-gray-800 shadow-xs'
              }`}
            >
              {/* LEFT SIDE: Irfan's Marking Area */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-medium mb-1 truncate max-w-[80px]">
                  {partner1Name}
                </span>
                <button
                  type="button"
                  onClick={() => handleTogglePrayer('partner1', salah.id)}
                  className={`w-full max-w-[110px] py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                    p1Done
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-xs shadow-emerald-900/50'
                      : isDark
                      ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-400 border-gray-200'
                  }`}
                >
                  {p1Done ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Prayed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-gray-400" />
                      <span>Not Yet</span>
                    </>
                  )}
                </button>
              </div>

              {/* CENTER: Prayer Info */}
              <div className="flex flex-col items-center justify-center text-center px-2 min-w-[100px] sm:min-w-[140px]">
                <div className={`p-1.5 rounded-full mb-1 ${
                  isDark ? 'bg-slate-800/80' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${salah.color}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold tracking-tight">{salah.name}</h4>
                  <span className="text-[11px] text-emerald-500 font-serif font-bold">
                    {salah.arabic}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {salah.desc}
                </span>
              </div>

              {/* RIGHT SIDE: Shahana's Marking Area */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-medium mb-1 truncate max-w-[80px]">
                  {partner2Name}
                </span>
                <button
                  type="button"
                  onClick={() => handleTogglePrayer('partner2', salah.id)}
                  className={`w-full max-w-[110px] py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border ${
                    p2Done
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-xs shadow-emerald-900/50'
                      : isDark
                      ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-400 border-gray-200'
                  }`}
                >
                  {p2Done ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Prayed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-gray-400" />
                      <span>Not Yet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Islamic Spiritual Reminder Card */}
      <div className={`mt-8 p-4 rounded-2xl border text-center transition-colors ${
        isDark 
          ? 'bg-slate-900/70 border-slate-800 text-slate-300' 
          : 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
      }`}>
        <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-xs uppercase tracking-wider mb-1.5">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Barakah in Marriage Reminder</span>
        </div>
        <p className="text-xs sm:text-sm italic font-serif leading-relaxed">
          {dailyReminder}
        </p>
      </div>
    </div>
  );
}
