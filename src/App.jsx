import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyReveal from './components/DailyReveal';
import GalleryView from './components/GalleryView';
import LoveBoard from './components/LoveBoard';
import DateSpinner from './components/DateSpinner';
import UploadModal from './components/UploadModal';
import SettingsModal from './components/SettingsModal';
import PinLock from './components/PinLock';
import EditMemoryModal from './components/EditMemoryModal';
import { getAllMemories, deleteMemory } from './utils/db';
import { subscribeToMemories } from './utils/firebase';
import { DEFAULT_QUOTES } from './data/quotes';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [memories, setMemories] = useState([]);
  const [quotes] = useState(DEFAULT_QUOTES);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);

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

  // Load memories from IndexedDB & automatically purge any old demo/sample photos
  const refreshMemories = async () => {
    try {
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
      setMemories([]);
    }
  };

  useEffect(() => {
    refreshMemories();

    // Real-time synchronization across iPhone & Android via Firebase
    const unsubscribe = subscribeToMemories((cloudList) => {
      if (cloudList && Array.isArray(cloudList)) {
        setMemories(cloudList);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50/60 via-white to-pink-50/40 flex flex-col selection:bg-rose-200">
      {/* 4-Digit Security PIN Lock Screen */}
      {isLocked && pinEnabled && (
        <PinLock
          correctPin={appPin}
          onUnlock={handleUnlock}
          coupleNames={coupleNames}
        />
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLock={handleLock}
        coupleNames={coupleNames}
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
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            memories={memories}
            onMemoryUpdated={refreshMemories}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'board' && (
          <LoveBoard coupleNames={coupleNames} />
        )}

        {activeTab === 'dates' && (
          <DateSpinner />
        )}
      </main>

      {/* Romantic Footer */}
      <footer className="py-6 border-t border-rose-100 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-1.5 text-rose-500 font-semibold mb-1">
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse-slow" />
          <span>Every day with you is a gift</span>
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
        </div>
        <p className="text-[11px] text-gray-400">
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
