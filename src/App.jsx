import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyReveal from './components/DailyReveal';
import GalleryView from './components/GalleryView';
import LoveBoard from './components/LoveBoard';
import SalahTracker from './components/SalahTracker';
import UploadModal from './components/UploadModal';

import SettingsModal from './components/SettingsModal';
import PinLock from './components/PinLock';
import EditMemoryModal from './components/EditMemoryModal';
import MoonBackground from './components/MoonBackground';
import { getAllMemories, deleteMemory } from './utils/db';
import { subscribeToMemories, fetchCloudMemories } from './utils/firebase';
import { DEFAULT_QUOTES } from './data/quotes';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [memories, setMemories] = useState([]);
  const [quotes] = useState(DEFAULT_QUOTES);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

  // Dark / Light Mode with Moon World Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('appTheme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [coupleNames, setCoupleNames] = useState(() => {
    return localStorage.getItem('coupleNames') || 'Irfan & Shahana';
  });


  const [startDate, setStartDate] = useState(() => {
    return localStorage.getItem('startDate') || '2026-03-23';
  });

  const [appPin, setAppPin] = useState(() => {
    return localStorage.getItem('appPin') || '0323';
  });

  const [pinEnabled, setPinEnabled] = useState(() => {
    return localStorage.getItem('pinEnabled') !== 'false';
  });

  const [isLocked, setIsLocked] = useState(() => {
    const enabled = localStorage.getItem('pinEnabled') !== 'false';
    const unlocked = sessionStorage.getItem('isUnlocked') === 'true';
    return enabled && !unlocked;
  });

  const handleUnlock = () => {
    sessionStorage.setItem('isUnlocked', 'true');
    setIsLocked(false);
  };

  const handleLock = () => {
    sessionStorage.removeItem('isUnlocked');
    setIsLocked(true);
  };

  // Load memories from cloud & local storage
  const refreshMemories = async () => {
    try {
      // 1. Fetch from Firebase Cloud first so partner's photos sync immediately
      const cloudMemories = await fetchCloudMemories();
      if (cloudMemories && cloudMemories.length > 0) {
        setMemories(cloudMemories);
        return;
      }

      // 2. Fallback to local storage
      const stored = await getAllMemories();
      const realMemories = [];
      for (const m of stored) {
        if (m.id && (m.id.startsWith('sample-') || m.id.startsWith('memory-'))) {
          await deleteMemory(m.id);
        } else {
          realMemories.push(m);
        }
      }
      setMemories(realMemories);
    } catch (err) {
      console.error("Failed loading memories:", err);
    }
  };

  useEffect(() => {
    refreshMemories();

    // 1. Real-time synchronization across iPhone & Android via Firebase
    const unsubscribe = subscribeToMemories((cloudList) => {
      if (cloudList && Array.isArray(cloudList)) {
        setMemories(cloudList);
      }
    });

    // 2. Auto sync whenever the app comes into focus on phone
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshMemories();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Silent background auto-sync every 8 seconds
    const interval = setInterval(() => {
      refreshMemories();
    }, 8000);

    return () => {
      if (unsubscribe) unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500/30 transition-colors duration-500 relative ${
      theme === 'dark' ? 'text-slate-100' : 'text-gray-800'
    }`}>
      {/* HD Animated World of Moon (Shahana's favorite) */}
      <MoonBackground theme={theme} />

      {/* 4-Digit Security PIN Lock Screen */}
      {isLocked && pinEnabled && (
        <PinLock
          correctPin={appPin}
          onUnlock={handleUnlock}
          theme={theme}
        />
      )}

      {/* Top Header with Dark/Light Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLock={handleLock}
        onSync={refreshMemories}
        coupleNames={coupleNames}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'daily' && (
          <DailyReveal
            memories={memories}
            quotes={quotes}
            startDate={startDate}
            coupleNames={coupleNames}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenEdit={(mem) => setEditingMemory(mem)}
            theme={theme}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            memories={memories}
            onMemoryUpdated={refreshMemories}
            onOpenUpload={() => setIsUploadOpen(true)}
            theme={theme}
          />
        )}

        {activeTab === 'board' && (
          <LoveBoard coupleNames={coupleNames} theme={theme} />
        )}

        {(activeTab === 'salah' || activeTab === 'dates') && (
          <SalahTracker coupleNames={coupleNames} theme={theme} />
        )}
      </main>


      {/* Romantic Moonlit Footer */}
      <footer className={`py-6 border-t text-center text-xs backdrop-blur-xs transition-colors duration-300 ${
        theme === 'dark'
          ? 'border-slate-800/80 bg-slate-950/40 text-slate-400'
          : 'border-rose-100 bg-white/40 text-gray-500'
      }`}>
        <div className={`flex items-center justify-center gap-1.5 font-semibold mb-1 ${
          theme === 'dark' ? 'text-indigo-400' : 'text-rose-500'
        }`}>
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse-slow" />
          <span>Under the same moon, forever with you</span>
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
        </div>
        <p className={`text-[11px] ${
          theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
        }`}>
          Built with love for Irfan & Shahana
        </p>
      </footer>


      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onMemoryAdded={refreshMemories}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        coupleNames={coupleNames}
        setCoupleNames={setCoupleNames}
        startDate={startDate}
        setStartDate={setStartDate}
        appPin={appPin}
        setAppPin={setAppPin}
        pinEnabled={pinEnabled}
        setPinEnabled={setPinEnabled}
        onDataReset={refreshMemories}
      />

      {editingMemory && (
        <EditMemoryModal
          isOpen={!!editingMemory}
          memory={editingMemory}
          onClose={() => setEditingMemory(null)}
          onMemoryUpdated={refreshMemories}
        />
      )}
    </div>
  );
}
