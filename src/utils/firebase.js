import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  getDocs
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWfu9hcPyZW3E4E8hdVuJ_S-Ux3j98VdQ",
  authDomain: "irfan-eda49.firebaseapp.com",
  projectId: "irfan-eda49",
  storageBucket: "irfan-eda49.firebasestorage.app",
  messagingSenderId: "524346980956",
  appId: "1:524346980956:web:9b414f265b9a274a70c499",
  measurementId: "G-L1ZG3EKCJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

// Realtime listener for memories
export function subscribeToMemories(callback) {
  const colRef = collection(firestore, "memories");
  return onSnapshot(colRef, (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    // Sort by createdAt or date descending
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  }, (error) => {
    console.error("Firestore memories subscription error:", error);
  });
}

// Fetch memories from cloud directly
export async function fetchCloudMemories() {
  try {
    const colRef = collection(firestore, "memories");
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return list;
  } catch (err) {
    console.error("fetchCloudMemories error:", err);
    return [];
  }
}

// Save or update memory to cloud
export async function syncSaveMemory(memory) {
  if (!memory.id) return;
  const docRef = doc(firestore, "memories", memory.id);
  await setDoc(docRef, memory, { merge: true });
}

// Delete memory from cloud
export async function syncDeleteMemory(id) {
  if (!id) return;
  const docRef = doc(firestore, "memories", id);
  await deleteDoc(docRef);
}

// Realtime listener for love notes
export function subscribeToNotes(callback) {
  const colRef = collection(firestore, "notes");
  return onSnapshot(colRef, (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    list.sort((a, b) => (b.createdAtTime || 0) - (a.createdAtTime || 0));
    callback(list);
  }, (error) => {
    console.error("Firestore notes subscription error:", error);
  });
}

// Save or update note to cloud
export async function syncSaveNote(note) {
  if (!note.id) return;
  const docRef = doc(firestore, "notes", note.id);
  await setDoc(docRef, { ...note, createdAtTime: Date.now() }, { merge: true });
}

// Delete note from cloud
export async function syncDeleteNote(id) {
  if (!id) return;
  const docRef = doc(firestore, "notes", id);
  await deleteDoc(docRef);
}

// Realtime listener for couple Salah prayers for a specific date
export function subscribeToSalah(dateStr, callback) {
  if (!dateStr) return () => {};
  const docRef = doc(firestore, "salah", dateStr);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Firestore salah subscription error:", error);
  });
}

// Save or update couple Salah prayers for a date
export async function syncSaveSalah(dateStr, data) {
  if (!dateStr || !data) return;
  const docRef = doc(firestore, "salah", dateStr);
  await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
}

