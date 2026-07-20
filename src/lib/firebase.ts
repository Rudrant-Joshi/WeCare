import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, Firestore } from 'firebase/firestore';
import { User, Appointment } from '../types';

// Lazy Firebase initialization to prevent crashes on startup
let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
};


export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId
  );
}

function getFirebaseDb(): Firestore | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  try {
    if (!firebaseApp) {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApp();
      }
    }
    if (!firestoreDb) {
      firestoreDb = getFirestore(firebaseApp);
    }
    return firestoreDb;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
}

// ----------------------
// Users Operations
// ----------------------

export async function saveUserToFirestore(user: User): Promise<void> {
  const db = getFirebaseDb();
  
  // Local write logic helper
  const saveLocally = () => {
    try {
      const savedUsers = localStorage.getItem('wecare_users');
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];
      const updated = users.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
      updated.push(user);
      localStorage.setItem('wecare_users', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  };

  if (!db) {
    saveLocally();
    return;
  }

  try {
    // Write to /users collection in Firestore
    const userRef = doc(db, 'users', user.id || `USR-${Math.floor(100000 + Math.random() * 900000)}`);
    // Make sure we store standard attributes, including password if it exists (for sandbox login capability)
    await setDoc(userRef, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'patient',
      createdAt: user.createdAt || new Date().toISOString(),
      ...(user.password ? { password: user.password } : {}),
    }, { merge: true });
    
    console.log(`Successfully synced user ${user.name} to Firestore.`);
  } catch (err) {
    console.error('Error syncing user to Firestore, falling back to local storage:', err);
    saveLocally();
  }
}

export async function getUsersFromFirestore(): Promise<User[]> {
  const db = getFirebaseDb();
  if (!db) {
    try {
      const savedUsers = localStorage.getItem('wecare_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    } catch (e) {
      console.error('LocalStorage read failed:', e);
      return [];
    }
  }

  try {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    const users: User[] = [];
    snapshot.forEach((d) => {
      users.push(d.data() as User);
    });
    return users;
  } catch (err) {
    console.error('Error reading users from Firestore:', err);
    // fallback
    const savedUsers = localStorage.getItem('wecare_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  }
}

// ----------------------
// Appointments Operations
// ----------------------

export async function saveAppointmentToFirestore(app: Appointment): Promise<void> {
  const db = getFirebaseDb();
  
  const saveLocally = () => {
    try {
      const saved = localStorage.getItem('wecare_appointments');
      const appointments: Appointment[] = saved ? JSON.parse(saved) : [];
      const updated = appointments.filter((a) => a.id !== app.id);
      updated.unshift(app);
      localStorage.setItem('wecare_appointments', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  };

  if (!db) {
    saveLocally();
    return;
  }

  try {
    const appRef = doc(db, 'appointments', app.id);
    await setDoc(appRef, app, { merge: true });
    console.log(`Successfully synced appointment ${app.id} to Firestore.`);
  } catch (err) {
    console.error('Error syncing appointment to Firestore, falling back to local storage:', err);
    saveLocally();
  }
}

export async function getAppointmentsFromFirestore(): Promise<Appointment[]> {
  const db = getFirebaseDb();
  if (!db) {
    try {
      const saved = localStorage.getItem('wecare_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('LocalStorage read failed:', e);
      return [];
    }
  }

  try {
    const colRef = collection(db, 'appointments');
    const snapshot = await getDocs(colRef);
    const appointments: Appointment[] = [];
    snapshot.forEach((d) => {
      appointments.push(d.data() as Appointment);
    });
    return appointments;
  } catch (err) {
    console.error('Error reading appointments from Firestore:', err);
    // fallback
    const saved = localStorage.getItem('wecare_appointments');
    return saved ? JSON.parse(saved) : [];
  }
}

export async function deleteAppointmentFromFirestore(id: string): Promise<void> {
  const db = getFirebaseDb();
  
  const deleteLocally = () => {
    try {
      const saved = localStorage.getItem('wecare_appointments');
      const appointments: Appointment[] = saved ? JSON.parse(saved) : [];
      const updated = appointments.filter((a) => a.id !== id);
      localStorage.setItem('wecare_appointments', JSON.stringify(updated));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  };

  if (!db) {
    deleteLocally();
    return;
  }

  try {
    const appRef = doc(db, 'appointments', id);
    await deleteDoc(appRef);
    console.log(`Successfully deleted appointment ${id} from Firestore.`);
  } catch (err) {
    console.error('Error deleting appointment from Firestore, falling back to local storage:', err);
    deleteLocally();
  }
}
