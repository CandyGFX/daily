import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, MapPin, Edit3, Heart } from 'lucide-react';
import { saveMemory } from '../utils/db';

export default function EditMemoryModal({ isOpen, memory, onClose, onMemoryUpdated }) {
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memory) {
      setCaption(memory.caption || '');
      setDate(memory.date || new Date().toISOString().split('T')[0]);
      setLocation(memory.location || '');
      setQuote(memory.quote || '');
      setIsFavorite(!!memory.favorite);
    }
  }, [memory]);

  if (!isOpen || !memory) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = {
        ...memory,
        caption: caption.trim(),
        date: date,
        location: location.trim(),
        quote: quote.trim(),
        favorite: isFavorite,
        updatedAt: Date.now()
      };
      await saveMemory(updated);
      if (onMemoryUpdated) onMemoryUpdated();
      onClose();
    } catch (err) {
      console.error("Failed to update memory:", err);
      alert("Error saving edits. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Edit Photo Details</h3>
              <p className="text-[11px] text-gray-500">Update caption, date, or personal note</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Preview */}
        <div className="mt-4 flex items-center gap-3 p-2 bg-rose-50/50 rounded-2xl border border-rose-100">
          <img
            src={memory.imageUrl}
            alt="thumbnail"
            className="w-16 h-16 rounded-xl object-cover border border-rose-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">
              {caption || "No caption yet"}
            </p>
            <p className="text-[11px] text-gray-400">
              {date || "No date set"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-xl border transition-colors ${
              isFavorite
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-gray-400 border-gray-200'
            }`}
            title="Toggle favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Caption / Story
            </label>
            <input
              type="text"
              placeholder="e.g. Afternoon tea at our favorite spot"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-500" />
                <span>Date Taken</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Location</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Botanical Garden"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Custom Quote / Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Personal Love Note / Quote (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add a sweet memory note for this photo..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-full shadow-md shadow-rose-200 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
