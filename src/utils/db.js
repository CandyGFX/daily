import { syncSaveMemory, syncDeleteMemory, syncSaveNote, syncDeleteNote } from './firebase';

const DB_NAME = "ForeverDailyDB";
const DB_VERSION = 1;
const STORE_MEMORIES = "memories";
const STORE_NOTES = "loveNotes";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_MEMORIES)) {
        db.createObjectStore(STORE_MEMORIES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllMemories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEMORIES, "readonly");
    const store = tx.objectStore(STORE_MEMORIES);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMemory(memory) {
  // 1. Sync to cloud Firebase
  syncSaveMemory(memory).catch((err) => console.log("Cloud sync note:", err.message));

  // 2. Save locally in IndexedDB
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEMORIES, "readwrite");
    const store = tx.objectStore(STORE_MEMORIES);
    const request = store.put(memory);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteMemory(id) {
  // 1. Delete from cloud Firebase
  syncDeleteMemory(id).catch((err) => console.log("Cloud delete note:", err.message));

  // 2. Delete locally from IndexedDB
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEMORIES, "readwrite");
    const store = tx.objectStore(STORE_MEMORIES);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllNotes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, "readonly");
    const store = tx.objectStore(STORE_NOTES);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveNote(note) {
  // 1. Sync to cloud Firebase
  syncSaveNote(note).catch((err) => console.log("Cloud note sync:", err.message));

  // 2. Save locally
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, "readwrite");
    const store = tx.objectStore(STORE_NOTES);
    const request = store.put(note);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteNote(id) {
  // 1. Delete from cloud Firebase
  syncDeleteNote(id).catch((err) => console.log("Cloud note delete:", err.message));

  // 2. Delete locally
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NOTES, "readwrite");
    const store = tx.objectStore(STORE_NOTES);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
