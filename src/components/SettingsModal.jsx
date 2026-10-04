import React, { useState } from 'react';
import { 
  X, Settings, Download, Upload, 
  Cloud, ExternalLink 
} from 'lucide-react';
import { getAllMemories, getAllNotes, saveMemory, saveNote } from '../utils/db';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  coupleNames, 
  setCoupleNames, 
  startDate, 
  setStartDate,
  appPin,
  setAppPin,
  pinEnabled,
  setPinEnabled,
  onDataReset
}) {
  const [namesInput, setNamesInput] = useState(coupleNames || 'Irfan & Shahana');
  const [dateInput, setDateInput] = useState(startDate || '2026-03-23');
  const [pinInput, setPinInput] = useState(appPin || '0323');
  const [pinEnabledInput, setPinEnabledInput] = useState(pinEnabled !== false);
  const [activeTab, setActiveTab] = useState('profile');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('coupleNames', namesInput);
    localStorage.setItem('startDate', dateInput);
    localStorage.setItem('appPin', pinInput);
    localStorage.setItem('pinEnabled', pinEnabledInput ? 'true' : 'false');
    setCoupleNames(namesInput);
    setStartDate(dateInput);
    if (setAppPin) setAppPin(pinInput);
    if (setPinEnabled) setPinEnabled(pinEnabledInput);
    setStatusMsg('Settings & PIN saved successfully! 💕');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleExportBackup = async () => {
    try {
      const memories = await getAllMemories();
      const notes = await getAllNotes();
      const backupData = {
        coupleNames: namesInput,
        startDate: dateInput,
        exportedAt: new Date().toISOString(),
        memories,
        notes
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Our-Daily-Love-Backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export backup: " + err.message);
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.coupleNames) {
          localStorage.setItem('coupleNames', data.coupleNames);
          setCoupleNames(data.coupleNames);
          setNamesInput(data.coupleNames);
        }
        if (data.startDate) {
          localStorage.setItem('startDate', data.startDate);
          setStartDate(data.startDate);
          setDateInput(data.startDate);
        }

        if (Array.isArray(data.memories)) {
          for (const mem of data.memories) {
            await saveMemory(mem);
          }
        }

        if (Array.isArray(data.notes)) {
          for (const note of data.notes) {
            await saveNote(note);
          }
        }

        alert("Backup restored successfully! All photos and notes are loaded.");
        if (onDataReset) onDataReset();
        onClose();
      } catch (err) {
        alert("Failed to import file. Make sure it is a valid backup JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">App Settings & AWS Hosting</h3>
              <p className="text-xs text-gray-500">Customize your story & host 24/7 online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-rose-50/70 p-1 rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            Couple Profile
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'backup' ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            Sync & Backup
          </button>
          <button
            onClick={() => setActiveTab('aws')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'aws' ? 'bg-rose-500 text-white shadow-xs' : 'text-gray-600'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>AWS 24/7 Host</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Your Names
              </label>
              <input
                type="text"
                placeholder="e.g. Irfan & Shahana"
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Relationship Start Date / Anniversary
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                This powers the live "Days Together" milestone counter.
              </p>
            </div>

            <div className="pt-2 border-t border-rose-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  4-Digit PIN Protection
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={pinEnabledInput}
                    onChange={(e) => setPinEnabledInput(e.target.checked)}
                    className="w-4 h-4 text-rose-500 rounded-sm focus:ring-rose-400 accent-rose-500"
                  />
                  <span>Require PIN to open app</span>
                </label>
              </div>

              {pinEnabledInput && (
                <div>
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d{4}"
                    placeholder="Enter 4 digits (e.g. 0323)"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-mono tracking-widest text-center"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 text-center">
                    Default PIN: 0323 (Your relationship date March 23)
                  </p>
                </div>
              )}
            </div>

            {statusMsg && (
              <p className="text-xs text-emerald-600 font-semibold text-center bg-emerald-50 py-1.5 rounded-lg">
                {statusMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-3 rounded-full shadow-md shadow-rose-200 transition-all"
            >
              Save Profile
            </button>
          </form>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Export & Sync Photos to Partner's Phone
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Download a complete backup of all your uploaded photos, love notes, and relationship settings to share with your partner.
              </p>
              <button
                onClick={handleExportBackup}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-rose-500" />
                <span>Export Full Backup (.JSON)</span>
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Restore / Import Backup
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Upload a backup file from your partner to sync their photos and memories here.
              </p>
              <label className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-rose-500" />
                <span>Choose Backup JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'aws' && (
          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
              <h4 className="font-bold flex items-center gap-1.5 text-sm mb-1">
                <Cloud className="w-4 h-4 text-amber-700" />
                <span>24/7 Hosting with AWS Amplify</span>
              </h4>
              <p className="leading-relaxed">
                AWS Amplify provides <strong>100% 24/7 uptime</strong> with global CDN, free SSL (HTTPS), custom domain support, and a generous AWS Free Tier for your app.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-gray-800 uppercase text-[11px] tracking-wider">
                Step-by-Step 24/7 Deployment:
              </h5>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>
                  Build the production bundle by running:
                  <code className="block bg-gray-100 p-2 rounded-lg text-gray-800 font-mono mt-1 select-all">
                    npm run build
                  </code>
                </li>
                <li>
                  Open your <strong>AWS Management Console</strong> and search for <strong>AWS Amplify</strong>.
                </li>
                <li>
                  Click <strong>"Deploy an app"</strong> &rarr; Select <strong>"Deploy without Git provider"</strong> (or connect your GitHub repo).
                </li>
                <li>
                  Drag and drop the generated <code className="bg-gray-100 px-1 py-0.5 rounded">dist</code> folder (or zip) into AWS Amplify.
                </li>
                <li>
                  Click <strong>"Save and Deploy"</strong>. AWS will give you a permanent live 24/7 URL (e.g. <code>https://main.d12345.amplifyapp.com</code>) that both of you can access anytime on your phones!
                </li>
              </ol>
            </div>

            <div className="pt-2">
              <a
                href="https://console.aws.amazon.com/amplify"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
              >
                <span>Open AWS Amplify Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
