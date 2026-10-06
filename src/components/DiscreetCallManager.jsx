import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, Bell, Shield, Check, X, Sparkles, 
  BatteryCharging, Droplets, BookOpen, Moon, Radio,
  Volume2, Smartphone, AlertCircle
} from 'lucide-react';
import { 
  sendCallSignal, 
  respondCallSignal, 
  subscribeToCallSignal 
} from '../utils/firebase';

const DISGUISE_PRESETS = [
  {
    id: 'dhikr',
    name: 'Islamic Dhikr (Recommended)',
    icon: Moon,
    title: 'Daily Dhikr Reminder',
    body: 'SubhanAllah wa bihamdihi — remember Allah in your day.',
    color: 'emerald'
  },
  {
    id: 'battery',
    name: 'Battery Optimization',
    icon: BatteryCharging,
    title: 'Battery Saver Notice',
    body: 'Background cache optimized to preserve phone battery.',
    color: 'amber'
  },
  {
    id: 'health',
    name: 'Hydration & Health',
    icon: Droplets,
    title: 'Daily Health Tip',
    body: 'Remember to drink a glass of water and rest your eyes.',
    color: 'sky'
  },
  {
    id: 'reflection',
    name: 'Daily Inspiration',
    icon: BookOpen,
    title: 'Daily Reflection',
    body: 'Patience and peace bring blessings to your day.',
    color: 'purple'
  }
];

export default function DiscreetCallManager({ 
  isOpen, 
  onClose, 
  theme = 'dark',
  coupleNames = 'Irfan & Shahana'
}) {
  const isDark = theme === 'dark';

  // Identify who is holding this device: 'Irfan' or 'Shahana'
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'Irfan';
  });

  const [selectedDisguise, setSelectedDisguise] = useState(DISGUISE_PRESETS[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'default';
  });

  // Realtime received signal state
  const [incomingSignal, setIncomingSignal] = useState(null);
  const [outgoingSignal, setOutgoingSignal] = useState(null);
  const [statusFeedback, setStatusFeedback] = useState('');
  const lastHandledTsRef = useRef(0);

  // Save role change
  const handleRoleChange = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  // Request browser notification permission
  const handleRequestNotification = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === 'granted' && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Test phone vibration
  const handleTestVibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([400, 200, 400, 200, 600]);
      setStatusFeedback('Vibrating device... 📳');
      setTimeout(() => setStatusFeedback(''), 2000);
    } else {
      setStatusFeedback('Vibration not supported on this browser/device');
      setTimeout(() => setStatusFeedback(''), 3000);
    }
  };

  // Listen to Firestore call signals in realtime
  useEffect(() => {
    const unsubscribe = subscribeToCallSignal((signal) => {
      if (!signal || !signal.timestamp) return;

      const now = Date.now();
      const isFresh = now - signal.timestamp < 120000; // Within 2 minutes

      if (signal.sender === userRole) {
        // We are the sender: track status response from partner
        setOutgoingSignal(signal);
      } else if (isFresh && signal.sender !== userRole) {
        // We are the receiver!
        if (lastHandledTsRef.current !== signal.timestamp) {
          lastHandledTsRef.current = signal.timestamp;
          setIncomingSignal(signal);

          // 1. Trigger distinct phone vibration
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([400, 200, 400, 200, 600]);
            } catch (err) {}
          }

          // 2. Trigger System Notification (Camouflaged)
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
              if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((reg) => {
                  reg.showNotification(signal.disguiseTitle || 'Daily Dhikr Reminder', {
                    body: signal.disguiseBody || 'SubhanAllah wa bihamdihi — remember Allah in your day.',
                    icon: '/favicon.svg',
                    badge: '/favicon.svg',
                    vibrate: [400, 200, 400, 200, 600],
                    tag: 'discreet-call-alert',
                    renotify: true
                  });
                });
              } else {
                new Notification(signal.disguiseTitle || 'Daily Dhikr Reminder', {
                  body: signal.disguiseBody || 'SubhanAllah wa bihamdihi — remember Allah in your day.',
                  icon: '/favicon.svg'
                });
              }
            } catch (err) {}
          }
        }
      }
    });

    return () => unsubscribe();
  }, [userRole]);

  // Send the call signal to partner's phone
  const handleSendSignal = async () => {
    setIsSending(true);
    const title = customTitle.trim() || selectedDisguise.title;
    const body = customBody.trim() || selectedDisguise.body;

    try {
      await sendCallSignal({
        sender: userRole,
        disguiseTitle: title,
        disguiseBody: body,
        disguiseId: selectedDisguise.id
      });
      setStatusFeedback(`Signal sent! Her phone is vibrating with "${title}"... 📳`);
    } catch (e) {
      console.error(e);
      setStatusFeedback('Failed to send signal. Check internet connection.');
    } finally {
      setIsSending(false);
    }
  };

  // Partner replies: Free or Busy
  const handleResponse = async (status) => {
    try {
      await respondCallSignal(status);
      setIncomingSignal(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* RECEIVER'S CAMOUFLAGE ALERT BANNER (Zero Parent Suspicion)     */}
      {/* ============================================================== */}
      {incomingSignal && incomingSignal.status === 'pending' && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-bounce select-none">
          <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
            isDark 
              ? 'bg-slate-900/95 border-emerald-500/50 text-white shadow-emerald-950/60' 
              : 'bg-white/95 border-emerald-200 text-gray-800 shadow-emerald-200/80'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    {incomingSignal.disguiseTitle || 'Daily Dhikr Reminder'}
                  </h4>
                  <p className={`text-xs mt-0.5 leading-snug font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    {incomingSignal.disguiseBody || 'SubhanAllah wa bihamdihi — remember Allah in your day.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIncomingSignal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Discreet Quick Response Buttons for Shahana */}
            <div className="mt-3.5 pt-3 border-t border-slate-700/40 flex items-center justify-end gap-2">
              <span className={`text-[10px] mr-auto font-medium ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                Discreet response:
              </span>
              <button
                type="button"
                onClick={() => handleResponse('busy')}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Family Near (Don't Call)</span>
              </button>
              <button
                type="button"
                onClick={() => handleResponse('free')}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Free to talk 💕</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SENDER'S DIALOG / SETTINGS MODAL (Irfan triggers call signal)   */}
      {/* ============================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
          <div className={`relative max-w-md w-full rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all ${
            isDark 
              ? 'bg-slate-900/95 border-slate-800 text-white shadow-black/80' 
              : 'bg-white border-rose-100 text-gray-800 shadow-rose-200/50'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Discreet Call Signal</h3>
                  <p className="text-[11px] text-gray-400">Vibrate her phone without raising doubt</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Device Role Switcher */}
            <div className="my-3.5 p-2.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
              <span className="text-xs text-gray-300 font-medium">This Phone Belongs To:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleRoleChange('Irfan')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'Irfan'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Irfan 👨🏻
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('Shahana')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'Shahana'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Shahana 👩🏻
                </button>
              </div>
            </div>

            {/* Notification Permission & Vibration Test */}
            <div className="flex items-center justify-between text-xs py-1 px-1 text-gray-400">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Vibration & Alert Status:</span>
              </div>
              <div className="flex items-center gap-2">
                {notificationPermission !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleRequestNotification}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Enable Notifications
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleTestVibrate}
                  className="text-[11px] text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Test Buzz 📳
                </button>
              </div>
            </div>

            {/* Choose Camouflage Preset */}
            <div className="mt-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Choose Camouflage Subtitle (Seen by Parents):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DISGUISE_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedDisguise.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedDisguise(preset)}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                          : 'border-slate-800 bg-slate-800/40 text-gray-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-gray-400'}`} />
                        <span className="text-[11px] font-bold leading-none">{preset.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 line-clamp-1">{preset.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camouflage Preview Box */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>What Her Screen Will Display:</span>
              </div>
              <div className="font-semibold text-gray-200 text-xs">
                {selectedDisguise.title}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                "{selectedDisguise.body}"
              </div>
              <div className="text-[10px] text-indigo-300 mt-1 italic">
                + Phone will pulse with double vibration alert 📳
              </div>
            </div>

            {/* Outgoing Signal Status Display (Realtime Partner Response) */}
            {outgoingSignal && outgoingSignal.timestamp && (Date.now() - outgoingSignal.timestamp < 180000) && (
              <div className="mt-3 p-3 rounded-2xl border text-xs text-center transition-all animate-fadeIn">
                {outgoingSignal.status === 'pending' && (
                  <div className="text-amber-400 flex items-center justify-center gap-1.5 font-medium">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Signal active! Waiting for Ponnu to respond...</span>
                  </div>
                )}
                {outgoingSignal.status === 'free' && (
                  <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Ponnu is FREE to talk! Safe to call now 💕</span>
                  </div>
                )}
                {outgoingSignal.status === 'busy' && (
                  <div className="text-rose-400 font-bold flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Family is around / Busy! Do NOT call right now 🛑</span>
                  </div>
                )}
              </div>
            )}

            {statusFeedback && (
              <p className="text-[11px] text-center text-emerald-400 mt-2 font-medium">
                {statusFeedback}
              </p>
            )}

            {/* Trigger Button */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleSendSignal}
                disabled={isSending}
                className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isSending ? 'Sending Buzz...' : 'Buzz Her Phone Now 📳'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
