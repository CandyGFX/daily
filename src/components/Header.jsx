import React from 'react';
import { Heart, Sparkles, Image, BookOpen, Compass, Settings, Plus, Lock } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenUpload, onOpenSettings, onLock, coupleNames }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-rose-100 shadow-xs transition-all">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Couple Title */}
        <div 
          onClick={() => setActiveTab('daily')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 flex items-center gap-1.5 m-0 leading-none">
              <span>{coupleNames || "Our Love Story"}</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-xs text-rose-500 font-medium mt-0.5">Daily Moments & Quotes</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-rose-50/70 p-1 rounded-full border border-rose-100">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Today's Reveal
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Memories ({activeTab === 'gallery' ? 'Active' : 'Album'})
          </button>
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'board'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Love Notes
          </button>
          <button
            onClick={() => setActiveTab('dates')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'dates'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-rose-600 hover:bg-rose-100/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Date Ideas
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm hover:shadow-rose-300 transition-all cursor-pointer"
            title="Upload new photo & memory"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Photo</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
            title="Relationship Settings & Security"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onLock}
            className="p-2 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
            title="Lock Vault"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden border-t border-rose-100 bg-white/95 px-2 py-1 justify-around text-xs">
        <button
          onClick={() => setActiveTab('daily')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 ${
            activeTab === 'daily' ? 'text-rose-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Today</span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 ${
            activeTab === 'gallery' ? 'text-rose-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Photos</span>
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 ${
            activeTab === 'board' ? 'text-rose-600 font-bold' : 'text-gray-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes</span>
        </button>
        <button
          onClick={() => setActiveTab('dates')}
          className={`py-1.5 px-2.5 rounded-lg flex flex-col items-center gap-0.5 ${
            activeTab === 'dates' ? 'text-rose-600 font-bold' : 'text-gray-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Dates</span>
        </button>
      </div>
    </header>
  );
}
