import React, { useState, useEffect } from 'react';
import { Heart, Plus, Trash2, Send, MessageCircleHeart } from 'lucide-react';
import { getAllNotes, saveNote, deleteNote } from '../utils/db';
import { subscribeToNotes } from '../utils/firebase';

const NOTE_COLORS = [
  'bg-rose-100 border-rose-200 text-rose-900',
  'bg-amber-100 border-amber-200 text-amber-900',
  'bg-pink-100 border-pink-200 text-pink-900',
  'bg-purple-100 border-purple-200 text-purple-900',
  'bg-emerald-100 border-emerald-200 text-emerald-900'
];

export default function LoveBoard({ coupleNames, theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  const loadNotes = async () => {
    const list = await getAllNotes();
    if (list.length === 0) {
      const initial = {
        id: 'initial_note',
        content: "Leave surprise sweet messages, compliments, or reminders for each other here! 💕",
        author: "Irfan & Shahana",
        colorClass: NOTE_COLORS[0],
        createdAt: new Date().toLocaleDateString()
      };
      await saveNote(initial);
      setNotes([initial]);
    } else {
      setNotes(list);
    }
  };

  useEffect(() => {
    loadNotes();

    // Real-time synchronization of notes across iPhone & Android
    const unsubscribe = subscribeToNotes((cloudNotes) => {
      if (cloudNotes && Array.isArray(cloudNotes) && cloudNotes.length > 0) {
        setNotes(cloudNotes);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote = {
      id: 'note_' + Date.now(),
      content: content.trim(),
      author: author.trim() || "Your Love",
      colorClass: NOTE_COLORS[colorIndex],
      createdAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };

    await saveNote(newNote);
    setContent('');
    await loadNotes();
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    await loadNotes();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
          isDark ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60' : 'bg-rose-100 text-rose-700'
        }`}>
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span>Private Love Notes & Sticky Board</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Sweet Little Notes for You
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Leave surprise messages, compliments, or romantic reminders for your partner.
        </p>
      </div>

      {/* Note Creation Form */}
      <form onSubmit={handleAddNote} className={`rounded-3xl p-5 shadow-sm border mb-8 max-w-xl mx-auto transition-colors ${
        isDark 
          ? 'bg-slate-900/85 backdrop-blur-xl border-slate-800 text-white' 
          : 'bg-white border-rose-100 text-gray-800'
      }`}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a sweet note... e.g. 'I loved drinking coffee with you this morning. Good luck today! 🥰'"
          className={`w-full text-sm p-3 rounded-2xl border resize-none focus:outline-hidden ${
            isDark 
              ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' 
              : 'border-gray-200 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
          }`}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="From: (e.g. Your Love)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`text-xs px-3 py-1.5 rounded-xl border focus:outline-hidden w-full sm:w-40 ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500' 
                  : 'border-gray-200 focus:ring-1 focus:ring-rose-400'
              }`}
            />
            {/* Color Pickers */}
            <div className="flex items-center gap-1">
              {NOTE_COLORS.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setColorIndex(idx)}
                  className={`w-5 h-5 rounded-full border-2 cursor-pointer ${c.split(' ')[0]} ${
                    colorIndex === idx ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className={`w-full sm:w-auto text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isDark 
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50' 
                : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin Note</span>
          </button>
        </div>
      </form>


      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-5 rounded-3xl border shadow-sm transition-all transform hover:-translate-y-1 relative group flex flex-col justify-between min-h-[140px] ${
              note.colorClass || NOTE_COLORS[0]
            }`}
          >
            <button
              onClick={() => handleDeleteNote(note.id)}
              className="absolute top-3 right-3 p-1 rounded-full text-black/30 hover:text-black/70 hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
              "{note.content}"
            </p>

            <div className="flex items-center justify-between text-[11px] font-semibold opacity-75 mt-4 pt-2 border-t border-black/10">
              <span>— {note.author}</span>
              <span>{note.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
