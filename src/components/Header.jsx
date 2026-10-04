import React, { useState } from 'react';
import { Heart, Sparkles, Image, BookOpen, CheckCircle2, Settings, Plus, Lock, RefreshCw, Moon, Sun } from 'lucide-react';


export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenUpload, 
  onOpenSettings, 
  onLock, 
  onSync, 
  coupleNames,
  theme = 'dark',
  onToggleTheme
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const isDark = theme === 'dark';

  const handleSyncClick = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    if (onSync) await onSync();
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 border-b ${
      isDark 
        ? 'bg-slate-950/75 border-slate-800/80 shadow-md shadow-black/20 text-white' 
        : 'bg-white/80 border-rose-100 shadow-xs text-gray-800'
    }`}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Couple Title */}
        <div 
          onClick={() => setActiveTab('daily')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform ${
            isDark 
              ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-900/50' 
              : 'bg-gradient-to-tr from-rose-500 to-pink-400 shadow-rose-200'
          }`}>
            <Heart className="w-5 h-5 fill-current animate-pulse-slow" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight flex items-center gap-1.5 m-0 leading-none ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              <span>{coupleNames || "Our Love Story"}</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h1>
            <p className={`text-xs font-medium mt-0.5 ${
              isDark ? 'text-indigo-300' : 'text-rose-500'
            }`}>
              Daily Moments & Quotes
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className={`hidden md:flex items-center space-x-1 p-1 rounded-full border ${
          isDark 
            ? 'bg-slate-900/80 border-slate-800' 
            : 'bg-rose-50/70 border-rose-100'
        }`}>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'daily'
                ? isDark 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-rose-500 text-white shadow-xs'
                : isDark 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Today's Reveal
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? isDark 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-rose-500 text-white shadow-xs'
                : isDark 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Memories ({activeTab === 'gallery' ? 'Active' : 'Album'})
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'board'
                ? isDark 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-rose-500 text-white shadow-xs'
                : isDark 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Love Notes
          </button>
          <button
            onClick={() => setActiveTab('salah')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'salah'
                ? isDark 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-emerald-600 text-white shadow-xs'
                : isDark 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Daily Salah
          </button>
        </nav>


        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Add Photo Button */}
          <button
            onClick={onOpenUpload}
            className={`flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm transition-all cursor-pointer ${
              isDark 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-900/40' 
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
            }`}
            title="Upload new photo & memory"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Photo</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`p-2 rounded-full transition-colors cursor-pointer border ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-100'
            }`}
            title="Sync Cloud Photos & Notes"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Dark / Light Moon Mode Toggle Switch */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-all cursor-pointer border ${
              isDark
                ? 'bg-indigo-950/60 hover:bg-indigo-900/80 text-amber-300 border-indigo-800/60 shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200/60 shadow-xs'
            }`}
            title={isDark ? "Switch to Twilight Light Mode" : "Switch to Moonlit Night Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-300 hover:scale-110 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-full transition-colors cursor-pointer border ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-100'
            }`}
            title="Relationship Settings & Security"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Discreet Lock Button */}
          <button
            onClick={onLock}
            className={`p-2 rounded-full transition-colors cursor-pointer border ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800'
                : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-100'
            }`}
            title="Lock Vault"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className={`flex md:hidden border-t px-2 py-1 justify-around text-xs transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-300' 
          : 'bg-white/95 border-rose-100 text-gray-500'
      }`}>
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'daily' 
              ? (isDark ? 'text-indigo-400 font-bold' : 'text-rose-600 font-bold') 
              : ''
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Today</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'gallery' 
              ? (isDark ? 'text-indigo-400 font-bold' : 'text-rose-600 font-bold') 
              : ''
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Photos</span>
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'board' 
              ? (isDark ? 'text-indigo-400 font-bold' : 'text-rose-600 font-bold') 
              : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes</span>
        </button>
        <button
          onClick={() => setActiveTab('salah')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'salah' 
              ? (isDark ? 'text-emerald-400 font-bold' : 'text-emerald-600 font-bold') 
              : ''
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Salah</span>
        </button>
      </div>
    </header>
  );
}

