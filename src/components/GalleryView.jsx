import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Trash2, X, Plus, Edit3 } from 'lucide-react';
import { deleteMemory, saveMemory } from '../utils/db';
import EditMemoryModal from './EditMemoryModal';

export default function GalleryView({ memories, onMemoryUpdated, onOpenUpload, theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);

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
    if (confirm("Are you sure you want to remove this photo?")) {
      await deleteMemory(id);
      if (onMemoryUpdated) onMemoryUpdated();
      if (selectedPhoto && selectedPhoto.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  const handleOpenEdit = (memory, e) => {
    if (e) e.stopPropagation();
    setEditingMemory(memory);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-rose-100'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Our Photo Vault</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {memories?.length || 0} moments captured together
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              filterFavorite
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : isDark 
                  ? 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorite ? 'fill-current' : ''}`} />
            <span>{filterFavorite ? "Showing Favorites" : "All Photos"}</span>
          </button>

          <button
            onClick={onOpenUpload}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isDark 
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900/60'
                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photos</span>
          </button>
        </div>
      </div>


      {/* Grid */}
      {filteredMemories.length === 0 ? (
        <div className={`rounded-3xl p-12 text-center border border-dashed transition-all ${
          isDark 
            ? 'bg-slate-900/80 backdrop-blur-xl border-slate-700/80 text-white' 
            : 'bg-white border-rose-200 text-gray-800'
        }`}>
          <Heart className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-indigo-400' : 'text-rose-300'}`} />
          <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {memories.length === 0 ? "No photos added yet!" : "No favorite photos found"}
          </h3>
          <p className={`text-xs max-w-sm mx-auto mb-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {memories.length === 0
              ? "You can select multiple photos at once from your phone to start your timeline. You can always add or edit captions later!"
              : "Click the heart on any photo to pin it to your favorites."}
          </p>
          <button
            onClick={onOpenUpload}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-colors shadow-md inline-flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50' 
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
            }`}
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
              className={`rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col border ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-800 text-white hover:border-indigo-500/50' 
                  : 'bg-white/95 border-rose-100/80 text-gray-800'
              }`}
              style={{ contentVisibility: 'auto', containIntrinsicSize: '360px', transform: 'translateZ(0)' }}
            >

              {/* Photo Area */}
              <div className={`relative aspect-4/3 overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-rose-50'}`}>
                <img
                  src={mem.imageUrl}
                  alt={mem.caption || "memory"}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Floating Heart / Edit / Delete Actions */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleOpenEdit(mem, e)}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white backdrop-blur-xs shadow-xs transition-colors cursor-pointer"
                    title="Edit caption, date, or note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => toggleFavorite(mem, e)}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-rose-400 backdrop-blur-xs shadow-xs transition-colors cursor-pointer"
                    title="Favorite"
                  >
                    <Heart className={`w-3.5 h-3.5 ${mem.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(mem.id, e)}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-gray-400 hover:text-red-400 backdrop-blur-xs shadow-xs transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className={`flex items-center justify-between text-[11px] mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      {mem.date || "Date unassigned"}
                    </span>
                    {mem.location && (
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-semibold line-clamp-2 ${
                    isDark ? 'text-slate-100' : 'text-gray-800'
                  }`}>
                    {mem.caption || <span className="text-gray-400 italic font-normal">Click pencil to add a caption</span>}
                  </p>
                </div>

                {mem.quote && (
                  <p className={`text-xs italic font-serif mt-2 line-clamp-2 p-2 rounded-lg ${
                    isDark 
                      ? 'bg-slate-950/60 text-indigo-300 border border-slate-800' 
                      : 'bg-rose-50/50 text-rose-600/90'
                  }`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-gray-800'
          }`}>
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={() => {
                  const target = selectedPhoto;
                  setSelectedPhoto(null);
                  handleOpenEdit(target);
                }}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors flex items-center gap-1 text-xs cursor-pointer"
                title="Edit caption"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className={`p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-800'}`}>
              <div className={`flex items-center justify-between text-xs mb-2 ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {selectedPhoto.date || "Date unassigned"}
                </span>
                {selectedPhoto.location && (
                  <span className={`flex items-center gap-1 font-medium ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedPhoto.location}
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {selectedPhoto.caption || "A sweet memory together"}
              </h3>

              {selectedPhoto.quote && (
                <div className={`p-3 rounded-xl text-xs sm:text-sm italic font-serif ${
                  isDark 
                    ? 'bg-slate-950/80 text-indigo-300 border border-slate-800' 
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  "{selectedPhoto.quote}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Memory Modal */}
      {editingMemory && (
        <EditMemoryModal
          isOpen={!!editingMemory}
          memory={editingMemory}
          onClose={() => setEditingMemory(null)}
          onMemoryUpdated={onMemoryUpdated}
        />
      )}
    </div>
  );
}
