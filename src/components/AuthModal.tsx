import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { getUsersFromFirestore, saveUserToFirestore } from '../lib/firebase';
import { getUsersFromSupabase, saveUserToSupabase, signInWithSupabase, signUpWithSupabase, logAuthEventToSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status/Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForms = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setErrors({});
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setErrors({});
    setSuccessMsg('');
  };

  const validateLogin = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!loginEmail.trim()) {
      tempErrors.loginEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      tempErrors.loginEmail = 'Please provide a valid email';
    }
    if (!loginPassword) {
      tempErrors.loginPassword = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      // 1. Try Supabase Auth first
      await signInWithSupabase(loginEmail.toLowerCase().trim(), loginPassword);

      // Fetch users from Supabase and Firestore
      const supabaseUsers: User[] = await getUsersFromSupabase();
      const firestoreUsers: User[] = await getUsersFromFirestore();
      const allUsers = [...supabaseUsers, ...firestoreUsers];

      // Check if admin credentials matched
      const isEmailAdmin = loginEmail.toLowerCase().trim() === 'rudrant.joshi@gmail.com';
      const isPasswordAdmin = loginPassword === 'rudrant';

      if (isEmailAdmin && isPasswordAdmin) {
        // Admin login success
        const adminUser: User = {
          id: 'USR-ADMIN',
          name: 'Rudrant Joshi',
          email: 'rudrant.joshi@gmail.com',
          phone: '+1 (555) 019-2834',
          role: 'admin',
          createdAt: new Date().toISOString()
        };

        await saveUserToSupabase({ ...adminUser, password: 'rudrant' });
        await saveUserToFirestore({ ...adminUser, password: 'rudrant' });
        await logAuthEventToSupabase(adminUser.email, 'SIGN_IN', adminUser.id);

        onLoginSuccess(adminUser);
        setSuccessMsg('Successfully logged in as Administrator!');
        setTimeout(() => {
          onClose();
          resetForms();
        }, 800);
        return;
      }

      // Find user matching credentials
      const foundUser = allUsers.find(
        u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && (u.password === loginPassword || !u.password)
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        const loggedInUser = { ...userWithoutPassword, role: userWithoutPassword.role || 'patient' };
        
        // Ensure user is synced in Supabase
        await saveUserToSupabase({ ...foundUser, password: loginPassword });
        await logAuthEventToSupabase(foundUser.email, 'SIGN_IN', foundUser.id);

        onLoginSuccess(loggedInUser);
        setSuccessMsg('Successfully logged in!');
        setTimeout(() => {
          onClose();
          resetForms();
        }, 800);
      } else {
        setErrors({ auth: 'Invalid email address or password. Please try again.' });
      }
    } catch (err) {
      console.error('Login error', err);
      setErrors({ auth: 'System error during authentication. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateRegister = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!regName.trim()) tempErrors.regName = 'Full name is required';
    
    if (!regEmail.trim()) {
      tempErrors.regEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      tempErrors.regEmail = 'Please provide a valid email';
    }

    if (!regPhone.trim()) {
      tempErrors.regPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(regPhone)) {
      tempErrors.regPhone = 'Provide a valid phone (e.g. 555-0192)';
    }

    if (!regPassword) {
      tempErrors.regPassword = 'Password is required';
    } else if (regPassword.length < 6) {
      tempErrors.regPassword = 'Password must be at least 6 characters';
    }

    if (regPassword !== regConfirmPassword) {
      tempErrors.regConfirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    try {
      const supabaseUsers: User[] = await getUsersFromSupabase();
      const firestoreUsers: User[] = await getUsersFromFirestore();
      const allUsers = [...supabaseUsers, ...firestoreUsers];

      // Check email duplication
      const emailExists = allUsers.some(u => u.email.toLowerCase() === regEmail.toLowerCase().trim());
      if (emailExists) {
        setErrors({ regEmail: 'This email is already registered with an account' });
        setIsLoading(false);
        return;
      }

      // 1. Sign up on Supabase Auth
      await signUpWithSupabase(regEmail.toLowerCase().trim(), regPassword, regName.trim(), regPhone.trim());

      // 2. Create new user object
      const newUser: User = {
        id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: regName.trim(),
        email: regEmail.toLowerCase().trim(),
        phone: regPhone.trim(),
        password: regPassword,
        role: 'patient',
        createdAt: new Date().toISOString()
      };

      // 3. Save to Supabase and Firestore
      await saveUserToSupabase(newUser);
      await saveUserToFirestore(newUser);
      await logAuthEventToSupabase(newUser.email, 'REGISTER', newUser.id);

      // Authenticate immediately
      const { password, ...userWithoutPassword } = newUser;
      onLoginSuccess(userWithoutPassword);
      setSuccessMsg('Account created successfully & saved to Supabase!');
      
      setTimeout(() => {
        onClose();
        resetForms();
      }, 1000);
    } catch (err) {
      console.error('Registration error', err);
      setErrors({ auth: 'Could not complete registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#FAF9F6] w-full max-w-md rounded-3xl overflow-hidden border border-[#E8E6E1] shadow-2xl text-left"
            id="auth-modal-container"
          >
            {/* Header branding band */}
            <div className="bg-[#5F7A61] px-6 py-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
                aria-label="Close Auth Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-[#D4A373]" />
                <span className="text-[11px] font-bold tracking-wider uppercase font-mono text-white/80">Secure Medical Portal</span>
              </div>
              <h2 className="font-sans font-bold text-2xl tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Patient Registration'}
              </h2>
              <p className="text-white/80 text-xs mt-1">
                {mode === 'login' 
                  ? 'Access your personal clinical consultation list and bookings.' 
                  : 'Register a secure digital healthcare file with WeCare Hospitals.'}
              </p>
            </div>

            {/* Toggle tabs */}
            <div className="flex border-b border-[#E8E6E1] bg-white">
              <button
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-3.5 text-center text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                  mode === 'login'
                    ? 'border-[#5F7A61] text-[#5F7A61] bg-[#FAF9F6]'
                    : 'border-transparent text-[#7D827D] hover:text-[#5F7A61]'
                }`}
                id="tab-mode-login"
              >
                Sign In
              </button>
              <button
                onClick={() => handleModeSwitch('signup')}
                className={`flex-1 py-3.5 text-center text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                  mode === 'signup'
                    ? 'border-[#5F7A61] text-[#5F7A61] bg-[#FAF9F6]'
                    : 'border-transparent text-[#7D827D] hover:text-[#5F7A61]'
                }`}
                id="tab-mode-signup"
              >
                Create Account
              </button>
            </div>

            {/* Form body */}
            <div className="p-6">
              {successMsg ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                  id="auth-success-screen"
                >
                  <div className="w-16 h-16 bg-[#E8F0E9] text-[#5F7A61] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D332D]">{successMsg}</h3>
                  <p className="text-[#6A706A] text-sm max-w-xs mx-auto">
                    Synchronizing secure medical records. Unlocking services...
                  </p>
                </motion.div>
              ) : (
                <>
                  {errors.auth && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                      <span className="font-bold">Error:</span>
                      <span>{errors.auth}</span>
                    </div>
                  )}

                  {mode === 'login' ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="e.g. joshi@example.com"
                            className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
                              errors.loginEmail ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                        </div>
                        {errors.loginEmail && <p className="text-rose-600 text-[11px] font-semibold">{errors.loginEmail}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
                              errors.loginPassword ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                        </div>
                        {errors.loginPassword && <p className="text-rose-600 text-[11px] font-semibold">{errors.loginPassword}</p>}
                      </div>

                      {/* Demo Accounts hint box */}
                      <div className="p-3 bg-[#E8F0E9] rounded-2xl border border-[#D1E2D4] text-xs text-[#5F7A61] space-y-1">
                        <p className="font-bold">💡 Patient Portal Sandbox Access</p>
                        <p>No account yet? Click the <strong>Create Account</strong> tab to easily register. It is secure and persistent!</p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5F7A61] hover:bg-[#4D634F] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        id="btn-login-submit"
                      >
                        {isLoading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Sign In to Portal'
                        )}
                      </button>
                    </form>
                  ) : (
                    /* SIGN UP FORM */
                    <form onSubmit={handleRegisterSubmit} className="space-y-4" id="signup-form">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Full Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
                          <input
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="e.g. Rudrant Joshi"
                            className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
                              errors.regName ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                        </div>
                        {errors.regName && <p className="text-rose-600 text-[11px] font-semibold">{errors.regName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="e.g. rudrant.joshi@gmail.com"
                            className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
                              errors.regEmail ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                        </div>
                        {errors.regEmail && <p className="text-rose-600 text-[11px] font-semibold">{errors.regEmail}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 019-2834"
                            className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-colors ${
                              errors.regPhone ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                        </div>
                        {errors.regPhone && <p className="text-rose-600 text-[11px] font-semibold">{errors.regPhone}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Password</label>
                          <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••"
                            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${
                              errors.regPassword ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                          {errors.regPassword && <p className="text-rose-600 text-[10px] font-semibold">{errors.regPassword}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-[#7D827D] uppercase tracking-wider block">Confirm</label>
                          <input
                            type="password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="••••••"
                            className={`w-full bg-white border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${
                              errors.regConfirmPassword ? 'border-rose-400 focus:border-rose-400' : 'border-[#E8E6E1] focus:border-[#5F7A61]'
                            }`}
                          />
                          {errors.regConfirmPassword && <p className="text-rose-600 text-[10px] font-semibold">{errors.regConfirmPassword}</p>}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#D4A373] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        id="btn-signup-submit"
                      >
                        {isLoading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
