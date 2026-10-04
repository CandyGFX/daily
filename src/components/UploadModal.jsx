import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check, Trash2, Sparkles } from 'lucide-react';
import { saveMemory } from '../utils/db';

export default function UploadModal({ isOpen, onClose, onMemoryAdded }) {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImages((prev) => [
          ...prev,
          {
            id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7),
            url: uploadEvent.target.result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please select at least one photo!");
      return;
    }

    setIsSubmitting(true);
    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const newMemory = {
          id: img.id,
          imageUrl: img.url,
          caption: caption.trim() || "", // can be edited later
          date: date,
          location: location.trim() || "",
          quote: quote.trim() || "",
          favorite: false,
          createdAt: Date.now() + i
        };
        await saveMemory(newMemory);
      }

      // Reset and notify
      setImages([]);
      setCaption('');
      setLocation('');
      setQuote('');
      if (onMemoryAdded) {
        await onMemoryAdded();
      }
      onClose();
    } catch (err) {
      console.error("Failed to save memory:", err);
      alert("Error saving photos. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Add Couple Photos</h3>
              <p className="text-xs text-gray-500">Select multiple photos at once — edit captions later anytime!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* File Picker Zone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Select Photos (Multiple Selection)
              </label>
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Select as many as you want!
              </span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <ImageIcon className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Click to choose photos from your phone or laptop</p>
              <p className="text-xs text-gray-400 mt-1">Select multiple photos from your gallery</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Previews */}
          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-rose-600">
                  Ready to upload {images.length} photo{images.length > 1 ? 's' : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-[11px] text-gray-400 hover:text-red-500 underline"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-100">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-200 border border-gray-200">
                    <img src={img.url} alt="upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Caption & Details */}
          <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Optional Details (Can edit later)
              </span>
              <span className="text-[11px] text-gray-400">
                Optional
              </span>
            </div>

            <div>
              <input
                type="text"
                placeholder="Caption for these photos (leave blank to add later)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
              />
              <input
                type="text"
                placeholder="Location (Optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Captions can be added or changed anytime.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || images.length === 0}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-md shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Saving Photos...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save {images.length > 0 ? `${images.length} Photos` : 'Memories'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
