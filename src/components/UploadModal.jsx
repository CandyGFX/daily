import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check, Trash2 } from 'lucide-react';
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
            id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
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
      alert("Please choose at least one photo!");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const img of images) {
        const newMemory = {
          id: img.id,
          imageUrl: img.url,
          caption: caption.trim() || "A precious memory together",
          date: date,
          location: location.trim() || "",
          quote: quote.trim() || "Forever grateful for you.",
          favorite: false,
          createdAt: Date.now()
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
              <h3 className="text-lg font-bold text-gray-800">Add Memories & Photos</h3>
              <p className="text-xs text-gray-500">Upload photos to be featured every day</p>
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
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Photos (Bulk upload supported)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <ImageIcon className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Click to browse or drop photos here</p>
              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP, HEIC</p>
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
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Selected Photos ({images.length})
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-200">
                    <img src={img.url} alt="upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memory Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Date Taken
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Venice, Paris, Our Living Room"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Memory Caption / Story
            </label>
            <input
              type="text"
              placeholder="e.g. The day we got lost in the rain and laughed until our stomachs hurt"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
            />
          </div>

          {/* Custom Quote / Love Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Custom Love Note / Quote (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Leave blank to automatically use one of the romantic quotes!"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none"
            />
          </div>

          {/* Submit */}
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
              disabled={isSubmitting || images.length === 0}
              className="px-6 py-2 text-xs font-semibold text-white bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full shadow-md shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Saving Photos...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save {images.length > 0 ? `(${images.length})` : ''} Memories</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
