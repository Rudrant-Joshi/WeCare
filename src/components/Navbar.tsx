import React, { useState } from 'react';
import { HeartPulse, Menu, X, Calendar, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onOpenBooking: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  isDbCloud?: boolean;
}

export default function Navbar({ 
  currentTab, 
  setTab, 
  onOpenBooking,
  currentUser,
  onLogout,
  onOpenAuth,
  isDbCloud = false
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'rudrant.joshi@gmail.com';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'bookings', label: 'My Appointments' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Portal' }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => { setTab('home'); setIsOpen(false); }}
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-100 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                  WeCare
                </span>
                <span className="text-teal-500 font-bold text-xl -ml-1">.</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse" id="db-status-pill">
                  Supabase Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium -mt-1 text-left">
                Hospitals
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setTab(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg hover:text-teal-600 ${
                    isActive ? 'text-teal-600' : 'text-slate-600'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-teal-50/50 rounded-lg -z-0 border-b-2 border-teal-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Call To Action & Auth Status */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-teal-50/50 px-3.5 py-1.5 rounded-2xl border border-[#D1E2D4]/50" id="user-profile-badge">
                <div className="w-8 h-8 rounded-full bg-[#5F7A61] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">{currentUser.name}</p>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-bold tracking-wider uppercase transition-colors block cursor-pointer"
                    id="btn-logout"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 text-[#5F7A61] hover:text-[#4D634F] font-semibold text-sm px-4 py-2 rounded-xl hover:bg-teal-50/30 transition-colors cursor-pointer"
                id="btn-nav-signin"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

            <button
              onClick={onOpenBooking}
              id="cta-book-now"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
            id="mobile-nav-panel"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      setTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-500' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-4 px-4 border-t border-gray-100 space-y-3">
                {currentUser ? (
                  <div className="flex items-center justify-between bg-teal-50/40 p-3 rounded-2xl border border-teal-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#5F7A61] text-white flex items-center justify-center font-bold text-sm uppercase">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                        <p className="text-xs text-slate-400">{currentUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      id="btn-mobile-logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                    id="btn-mobile-signin"
                  >
                    <LogIn className="w-5 h-5 text-slate-500" />
                    Sign In / Register
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenBooking();
                    setIsOpen(false);
                  }}
                  id="mobile-cta-book"
                  className="w-full flex items-center justify-center gap-2 bg-[#5F7A61] hover:bg-[#4D634F] text-white font-semibold py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-teal-200" />
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
