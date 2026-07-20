import { createClient } from '@supabase/supabase-js';
import { User, Appointment } from '../types';

const metaEnv = (import.meta as any).env || {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://dpndnzqzjftnbhqlydar.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JVEMHOIA4Q9tjfgT_7QiAg_wa2AB20y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// ----------------------
// Auth Operations
// ----------------------

export async function signUpWithSupabase(email: string, password?: string, name?: string, phone?: string) {
  try {
    const pwd = password || 'wecarePass123!';
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        data: {
          name: name || email.split('@')[0],
          phone: phone || '',
        },
      },
    });

    if (error) {
      console.warn('Supabase auth signup notice:', error.message);
    }
    return { data, error };
  } catch (err) {
    console.error('Error during Supabase signup:', err);
    return { data: null, error: err };
  }
}

export async function signInWithSupabase(email: string, password?: string) {
  try {
    const pwd = password || 'wecarePass123!';
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });
    return { data, error };
  } catch (err) {
    console.error('Error during Supabase signin:', err);
    return { data: null, error: err };
  }
}

export async function signOutWithSupabase() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Supabase signOut error:', error.message);
  } catch (err) {
    console.error('Error during Supabase signout:', err);
  }
}

export async function logAuthEventToSupabase(userEmail: string, eventType: 'SIGN_IN' | 'SIGN_OUT' | 'REGISTER', userId?: string): Promise<void> {
  try {
    const record = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId || 'unknown',
      user_email: userEmail,
      event_type: eventType,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('auth_logs').insert(record);
    if (error) {
      console.error('Error recording auth log in Supabase:', error.message);
    } else {
      console.log(`Recorded auth event ${eventType} for ${userEmail} in Supabase.`);
    }
  } catch (err) {
    console.error('Failed to log auth event to Supabase:', err);
  }
}


// ----------------------
// Users Operations (Profiles)
// ----------------------

export async function saveUserToSupabase(user: User): Promise<void> {
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

  try {
    const record = {
      id: user.id || `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'patient',
      password: user.password || '',
      created_at: user.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('users').upsert(record, { onConflict: 'id' });

    if (error) {
      console.error('Supabase users save error, falling back to local storage:', error.message);
      saveLocally();
    } else {
      console.log(`Successfully saved user ${user.name} to Supabase.`);
      saveLocally();
    }
  } catch (err) {
    console.error('Error saving user to Supabase:', err);
    saveLocally();
  }
}

export async function getUsersFromSupabase(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) {
      console.warn('Could not fetch users from Supabase, returning local storage users:', error?.message);
      const savedUsers = localStorage.getItem('wecare_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }

    const formatted: User[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      role: d.role,
      password: d.password,
      createdAt: d.created_at,
    }));

    return formatted;
  } catch (err) {
    console.error('Error fetching users from Supabase:', err);
    const savedUsers = localStorage.getItem('wecare_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  }
}

// ----------------------
// Appointments Operations
// ----------------------

export async function saveAppointmentToSupabase(app: Appointment): Promise<void> {
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

  try {
    const record = {
      id: app.id,
      user_id: app.userId,
      patient_name: app.patientName,
      patient_email: app.patientEmail,
      patient_phone: app.patientPhone,
      doctor_id: app.doctorId,
      doctor_name: app.doctorName,
      department: app.department,
      date: app.date,
      time: app.time,
      symptoms: app.symptoms,
      status: app.status || 'Confirmed',
      notes: app.notes || '',
      created_at: app.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase.from('appointments').upsert(record, { onConflict: 'id' });

    if (error) {
      console.error('Supabase appointment save error:', error.message);
      saveLocally();
    } else {
      console.log(`Successfully saved appointment ${app.id} to Supabase.`);
      saveLocally();
    }
  } catch (err) {
    console.error('Error saving appointment to Supabase:', err);
    saveLocally();
  }
}

export async function getAppointmentsFromSupabase(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error || !data) {
      console.warn('Could not fetch appointments from Supabase:', error?.message);
      const saved = localStorage.getItem('wecare_appointments');
      return saved ? JSON.parse(saved) : [];
    }

    const formatted: Appointment[] = data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      patientName: d.patient_name,
      patientEmail: d.patient_email,
      patientPhone: d.patient_phone,
      doctorId: d.doctor_id,
      doctorName: d.doctor_name,
      department: d.department,
      date: d.date,
      time: d.time,
      symptoms: d.symptoms,
      status: d.status,
      notes: d.notes,
      createdAt: d.created_at,
    }));

    return formatted;
  } catch (err) {
    console.error('Error reading appointments from Supabase:', err);
    const saved = localStorage.getItem('wecare_appointments');
    return saved ? JSON.parse(saved) : [];
  }
}

export async function deleteAppointmentFromSupabase(id: string): Promise<void> {
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

  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      console.error('Error deleting appointment from Supabase:', error.message);
      deleteLocally();
    } else {
      console.log(`Successfully deleted appointment ${id} from Supabase.`);
      deleteLocally();
    }
  } catch (err) {
    console.error('Error deleting appointment from Supabase:', err);
    deleteLocally();
  }
}

// ----------------------
// Contact Form Operations
// ----------------------

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  created_at?: string;
}

export async function saveContactSubmissionToSupabase(submission: ContactSubmission): Promise<void> {
  try {
    const record = {
      id: submission.id || `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: submission.name,
      email: submission.email,
      phone: submission.phone || '',
      subject: submission.subject || '',
      message: submission.message,
      created_at: submission.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from('contact_submissions').insert(record);
    if (error) {
      console.error('Error saving contact form to Supabase:', error.message);
    } else {
      console.log(`Successfully saved contact submission from ${submission.name} to Supabase.`);
    }
  } catch (err) {
    console.error('Error in saveContactSubmissionToSupabase:', err);
  }
}

export async function getContactSubmissionsFromSupabase(): Promise<ContactSubmission[]> {
  try {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error || !data) {
      console.warn('Could not fetch contact submissions from Supabase:', error?.message);
      return [];
    }
    return data as ContactSubmission[];
  } catch (err) {
    console.error('Error fetching contact submissions from Supabase:', err);
    return [];
  }
}
