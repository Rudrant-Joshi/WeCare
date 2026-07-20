/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import DepartmentsView from './components/DepartmentsView';
import DoctorsView from './components/DoctorsView';
import BookingsView from './components/BookingsView';
import AdminPortalView from './components/AdminPortalView';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import { Appointment, User } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Clock, HeartPulse, ShieldAlert } from 'lucide-react';
import { 
  getAppointmentsFromFirestore, 
  saveAppointmentToFirestore, 
  deleteAppointmentFromFirestore,
  saveUserToFirestore,
  getUsersFromFirestore,
  isFirebaseConfigured 
} from './lib/firebase';
import {
  getAppointmentsFromSupabase,
  saveAppointmentToSupabase,
  deleteAppointmentFromSupabase,
  saveUserToSupabase,
  getUsersFromSupabase,
  signOutWithSupabase,
  logAuthEventToSupabase,
  isSupabaseConfigured
} from './lib/supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);
  const [preselectedDepartmentId, setPreselectedDepartmentId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDbCloud, setIsDbCloud] = useState<boolean>(isSupabaseConfigured() || isFirebaseConfigured());
  
  // Auth states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Load active session, seed database and detect connection state
  useEffect(() => {
    const checkDb = () => {
      setIsDbCloud(isSupabaseConfigured() || isFirebaseConfigured());
    };
    checkDb();
  }, []);

  // Seed default admin user on mount & ensure fresh start
  useEffect(() => {
    const initializeUsers = async () => {
      try {
        // Clear any previous stored session so website starts fresh
        localStorage.removeItem('wecare_current_user');
        sessionStorage.removeItem('wecare_current_user');
        setCurrentUser(null);

        const supabaseUsers = await getUsersFromSupabase();
        const firestoreUsers = await getUsersFromFirestore();
        const allUsers = [...supabaseUsers, ...firestoreUsers];

        const adminExists = allUsers.some(u => u.email.toLowerCase() === 'rudrant.joshi@gmail.com');
        if (!adminExists) {
          const defaultUser = {
            id: 'USR-729183',
            name: 'Rudrant Joshi',
            email: 'rudrant.joshi@gmail.com',
            phone: '+1 (555) 019-2834',
            password: 'rudrant',
            role: 'admin' as const,
            createdAt: new Date().toISOString()
          };
          await saveUserToSupabase(defaultUser);
          await saveUserToFirestore(defaultUser);
        }
      } catch (err) {
        console.error('Failed to initialize users db', err);
      }
    };
    initializeUsers();
  }, []);


  // Load appointments from Supabase on mount
  useEffect(() => {
    const initializeAppointments = async () => {
      try {
        const subApps = await getAppointmentsFromSupabase();
        const fireApps = await getAppointmentsFromFirestore();

        const combinedMap = new Map<string, Appointment>();
        fireApps.forEach(a => { if (a.id !== 'APP-729183') combinedMap.set(a.id, a); });
        subApps.forEach(a => { if (a.id !== 'APP-729183') combinedMap.set(a.id, a); });
        const apps = Array.from(combinedMap.values());

        // Also clean up local storage if seed appointment exists
        try {
          const saved = localStorage.getItem('wecare_appointments');
          if (saved) {
            const parsed: Appointment[] = JSON.parse(saved);
            const filtered = parsed.filter(a => a.id !== 'APP-729183');
            localStorage.setItem('wecare_appointments', JSON.stringify(filtered));
          }
        } catch (e) {
          console.error(e);
        }

        setAppointments(apps);

      } catch (err) {
        console.error('Failed to load appointments', err);
      }
    };
    initializeAppointments();
  }, []);

  const handleBookingSuccess = async (newApp: Appointment) => {
    try {
      await saveAppointmentToSupabase(newApp);
      await saveAppointmentToFirestore(newApp);
      setAppointments(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
    } catch (err) {
      console.error('Failed to create booking', err);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await deleteAppointmentFromSupabase(id);
      await deleteAppointmentFromFirestore(id);
      setAppointments(prev => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error('Failed to cancel appointment', err);
    }
  };

  const handleUpdateAppointment = async (updatedApp: Appointment) => {
    try {
      await saveAppointmentToSupabase(updatedApp);
      await saveAppointmentToFirestore(updatedApp);
      setAppointments(prev => prev.map((app) => (app.id === updatedApp.id ? updatedApp : app)));
    } catch (err) {
      console.error('Failed to update appointment', err);
    }
  };

  const handleSelectDoctorForBooking = (doctorId: string) => {
    setPreselectedDoctorId(doctorId);
    setPreselectedDepartmentId(null);
    setIsBookingOpen(true);
  };

  const handleSelectDepartmentForBooking = (departmentId: string) => {
    setPreselectedDepartmentId(departmentId);
    setPreselectedDoctorId(null);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setPreselectedDoctorId(null);
    setPreselectedDepartmentId(null);
    setIsBookingOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };


  const handleLogout = async () => {
    if (currentUser) {
      await logAuthEventToSupabase(currentUser.email, 'SIGN_OUT', currentUser.id);
    }
    await signOutWithSupabase();
    setCurrentUser(null);
    try {
      localStorage.removeItem('wecare_current_user');
    } catch (err) {
      console.error('Failed to clear current user', err);
    }
    setCurrentTab('home');
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Render active view
  const renderView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            setTab={setCurrentTab}
            onOpenBooking={handleOpenGeneralBooking}
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
          />
        );
      case 'about':
        return <AboutView />;
      case 'departments':
        return (
          <DepartmentsView
            onSelectDepartmentForBooking={handleSelectDepartmentForBooking}
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
          />
        );
      case 'doctors':
        return (
          <DoctorsView
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
          />
        );
      case 'bookings':
        return (
          <BookingsView
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onOpenBooking={handleOpenGeneralBooking}
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        );
      case 'admin':
        return (
          <AdminPortalView
            appointments={appointments}
            onAddAppointment={handleBookingSuccess}
            onCancelAppointment={handleCancelAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            currentUser={currentUser}
          />
        );
      default:
        return (
          <HomeView
            setTab={setCurrentTab}
            onOpenBooking={handleOpenGeneralBooking}
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white" id="wecare-app-root">
      {/* Top Banner Alert for Operating hours */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-center gap-4 text-center border-b border-slate-800">
        <span className="flex items-center gap-1 font-medium">
          <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          OPD & Diagnostics Admissions Active
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="flex items-center gap-1 font-semibold text-teal-400">
          <HeartPulse className="w-3.5 h-3.5 shrink-0" />
          Emergency: +1 (555) 101-2000 (24 Hours Open)
        </span>
      </div>

      {/* Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setTab={setCurrentTab}
        onOpenBooking={handleOpenGeneralBooking}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => handleOpenAuth('login')}
        isDbCloud={isDbCloud}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Hospital Footer */}
      <Footer 
        setTab={setCurrentTab} 
        onOpenBooking={handleOpenGeneralBooking} 
      />

      {/* General Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedDoctorId={preselectedDoctorId}
        preselectedDepartmentId={preselectedDepartmentId}
        onBookingSuccess={handleBookingSuccess}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
      />

      {/* Patient Authentication Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />
    </div>
  );
}
