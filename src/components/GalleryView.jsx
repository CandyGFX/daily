import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Trash2, X, Plus } from 'lucide-react';
import { deleteMemory, saveMemory } from '../utils/db';

export default function GalleryView({ memories, onMemoryUpdated, onOpenUpload }) {
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredMemories = (memories || []).filter((m) => {
    if (filterFavorite && !m.favorite) return false;
    return true;
  });

  const toggleFavorite = async (memory, e) => {
    e.stopPropagation();
    const updated = { ...memory, favorite: !memory.favorite };
    await saveMemory(updated);
    if (onMemoryUpdated) onMemoryUpdated();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this photo memory?")) {
      await deleteMemory(id);
      if (onMemoryUpdated) onMemoryUpdated();
      if (selectedPhoto && selectedPhoto.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Our Photo Vault</h2>
          <p className="text-xs text-gray-500">
            {memories?.length || 0} precious moments captured together
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              filterFavorite
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorite ? 'fill-current' : ''}`} />
            <span>{filterFavorite ? "Showing Favorites" : "All Photos"}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload More</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredMemories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-rose-200">
          <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">No photos found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
            {filterFavorite
              ? "You haven't marked any photos as favorites yet! Click the heart on any photo to pin it here."
              : "Start creating your daily timeline by uploading your first couple photos!"}
          </p>
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md shadow-rose-200 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photos Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setSelectedPhoto(mem)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-rose-100/80 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* Photo Area */}
              <div className="relative aspect-4/3 overflow-hidden bg-rose-50">
                <img
                  src={mem.imageUrl}
                  alt={mem.caption || "memory"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Heart / Delete Actions */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => toggleFavorite(mem, e)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-rose-500 backdrop-blur-xs shadow-xs transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${mem.favorite ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(mem.id, e)}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 backdrop-blur-xs shadow-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      {mem.date}
                    </span>
                    {mem.location && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {mem.caption || "A sweet memory"}
                  </p>
                </div>

                {mem.quote && (
                  <p className="text-xs text-rose-600/90 italic font-serif mt-2 line-clamp-2 bg-rose-50/50 p-2 rounded-lg">
                    "{mem.quote}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Expanded Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {selectedPhoto.date}
                </span>
                {selectedPhoto.location && (
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedPhoto.location}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {selectedPhoto.caption}
              </h3>

              {selectedPhoto.quote && (
                <div className="p-3 bg-rose-50 rounded-xl text-xs sm:text-sm italic font-serif text-rose-700">
                  "{selectedPhoto.quote}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
