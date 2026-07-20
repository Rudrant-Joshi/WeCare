import React, { useState, useEffect } from 'react';
import { X, Calendar, User as UserIcon, Phone, Mail, FileText, CheckCircle, Clock, MapPin, Lock, LogIn, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Appointment, User } from '../types';
import { saveAppointmentToSupabase } from '../lib/supabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string | null;
  preselectedDepartmentId?: string | null;
  onBookingSuccess: (appointment: Appointment) => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId,
  onBookingSuccess,
  currentUser,
  onOpenAuth
}: BookingModalProps) {
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // Initialize and update selection based on preselected values
  useEffect(() => {
    if (isOpen) {
      if (preselectedDoctorId) {
        const doc = DOCTORS.find(d => d.id === preselectedDoctorId);
        if (doc) {
          setDoctorId(doc.id);
          setDepartmentId(doc.departmentId);
        }
      } else if (preselectedDepartmentId) {
        setDepartmentId(preselectedDepartmentId);
        setDoctorId('');
      } else {
        setDepartmentId('');
        setDoctorId('');
      }

      // Reset form fields
      if (currentUser) {
        setPatientName(currentUser.name);
        setPatientEmail(currentUser.email);
        setPatientPhone(currentUser.phone);
      } else {
        setPatientName('');
        setPatientEmail('');
        setPatientPhone('');
      }
      setDate('');
      setTimeSlot('');
      setNotes('');
      setErrors({});
      setBookedAppointment(null);
    }
  }, [isOpen, preselectedDoctorId, preselectedDepartmentId, currentUser]);

  // Update doctor options when department changes
  const filteredDoctors = DOCTORS.filter(d => d.departmentId === departmentId);

  // Handle department change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value;
    setDepartmentId(newDeptId);
    setDoctorId(''); // Reset doctor when department changes
  };

  // Get tomorrow's date string for input minimum
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Validate form
  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!patientName.trim()) tempErrors.patientName = 'Patient full name is required';
    
    if (!patientEmail.trim()) {
      tempErrors.patientEmail = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(patientEmail)) {
      tempErrors.patientEmail = 'Please provide a valid email';
    }

    if (!patientPhone.trim()) {
      tempErrors.patientPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(patientPhone)) {
      tempErrors.patientPhone = 'Provide a valid phone (e.g. 555-0192)';
    }

    if (!departmentId) tempErrors.departmentId = 'Please select a clinical department';
    if (!doctorId) tempErrors.doctorId = 'Please select a specialist doctor';
    if (!date) tempErrors.date = 'Appointment date is required';
    if (!timeSlot) tempErrors.timeSlot = 'Please choose a convenient time slot';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const selectedDept = DEPARTMENTS.find(d => d.id === departmentId);
      const selectedDoc = DOCTORS.find(d => d.id === doctorId);

      const newAppointment: Appointment = {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName,
        patientEmail,
        patientPhone,
        departmentId,
        doctorId,
        department: selectedDept?.name,
        doctorName: selectedDoc?.name,
        date,
        timeSlot,
        time: timeSlot,
        notes: notes.trim() || undefined,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      // Save directly to Supabase
      await saveAppointmentToSupabase(newAppointment);

      // Trigger parent handler & UI confirmation
      onBookingSuccess(newAppointment);
      setBookedAppointment(newAppointment);
    } catch (err) {
      console.error('Failed to save appointment to Supabase:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get details of selected department & doctor for success screen
  const confirmedDept = DEPARTMENTS.find(d => d.id === bookedAppointment?.departmentId);
  const confirmedDoc = DOCTORS.find(d => d.id === bookedAppointment?.doctorId);

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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100"
            id="booking-modal-content"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-sans font-bold text-slate-900">
                  {bookedAppointment ? 'Consultation Confirmed' : 'Book a Consultation'}
                </h2>
                <p className="text-xs text-slate-500">
                  {bookedAppointment ? 'Your clinical slot has been successfully scheduled' : 'Fill in the details below to register and book a specialist'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors"
                id="close-booking-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6">
              {!currentUser ? (
                <div className="p-8 text-center space-y-6" id="booking-modal-auth-gate">
                  <div className="w-16 h-16 bg-[#E8F0E9] text-[#5F7A61] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-slate-900">Patient Authentication Required</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      To comply with medical privacy guidelines and automatically save your appointments, you must be logged in to your WeCare Patient Portal to reserve a clinical slot.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-2">
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="flex-1 bg-[#5F7A61] hover:bg-[#4D634F] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      id="btn-modal-auth-login"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In to Portal
                    </button>
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="flex-1 bg-[#D4A373] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      id="btn-modal-auth-signup"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Create Account
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-100/85 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-teal-500" />
                    <span>Your patient file is secured with AES-256 standard and HIPAA guidelines.</span>
                  </div>
                </div>
              ) : !bookedAppointment ? (
                /* Interactive Form */
                <form onSubmit={handleSubmit} className="space-y-5" id="appointment-form">
                  {/* Step 1: Patient Information */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wider font-mono">
                      1. Patient Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className={`pl-9.5 w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 ${
                              errors.patientName
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                            }`}
                          />
                        </div>
                        {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="(555) 019-2834"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            className={`pl-9.5 w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 ${
                              errors.patientPhone
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                            }`}
                          />
                        </div>
                        {errors.patientPhone && <p className="text-red-500 text-xs mt-1">{errors.patientPhone}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="patient@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className={`pl-9.5 w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 ${
                            errors.patientEmail
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                          }`}
                        />
                      </div>
                      {errors.patientEmail && <p className="text-red-500 text-xs mt-1">{errors.patientEmail}</p>}
                    </div>
                  </div>

                  {/* Step 2: Medical Selection */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wider font-mono">
                      2. Clinical Specialization & Consultation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Department Select */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Clinical Department *</label>
                        <select
                          value={departmentId}
                          onChange={handleDepartmentChange}
                          className={`w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white ${
                            errors.departmentId
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                          }`}
                        >
                          <option value="">-- Choose Department --</option>
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                        {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
                      </div>

                      {/* Doctor Select */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Specialist Doctor *</label>
                        <select
                          value={doctorId}
                          onChange={(e) => setDoctorId(e.target.value)}
                          disabled={!departmentId}
                          className={`w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white disabled:bg-slate-50 disabled:text-slate-400 ${
                            errors.doctorId
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                          }`}
                        >
                          <option value="">
                            {!departmentId ? 'Select department first' : '-- Select Specialist --'}
                          </option>
                          {filteredDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} ({doc.degree})
                            </option>
                          ))}
                        </select>
                        {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Date & Schedule */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wider font-mono">
                      3. Date & Scheduling
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Preferred Date */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Date *</label>
                        <div className="relative">
                          <input
                            type="date"
                            min={getMinDate()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white ${
                              errors.date
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                            }`}
                          />
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        {doctorId && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            Available schedule:{' '}
                            <span className="font-semibold text-teal-600">
                              {DOCTORS.find(d => d.id === doctorId)?.schedule.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Preferred Time */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Time Slot *</label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className={`w-full rounded-xl border py-2 px-3 text-sm focus:outline-none focus:ring-2 bg-white ${
                            errors.timeSlot
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100'
                          }`}
                        >
                          <option value="">-- Choose Slot --</option>
                          <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                          <option value="Midday (12:00 PM - 2:00 PM)">Midday (12:00 PM - 2:00 PM)</option>
                          <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                        </select>
                        {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Reason for Consultation / Medical Concerns (Optional)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                      <textarea
                        rows={2}
                        placeholder="Please describe symptoms or reasons for booking (e.g. routine physical, heart pain, childhood vaccine)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="pl-9.5 w-full rounded-xl border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:border-teal-500 focus:ring-teal-100"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 border border-gray-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-600 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:bg-teal-400 flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Scheduling...
                        </>
                      ) : (
                        'Confirm Schedule'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Booking Success Receipt Details */
                <div className="space-y-6 py-2" id="success-receipt">
                  <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
                      <p className="text-sm text-slate-500">
                        Reference Number:{' '}
                        <span className="font-mono font-bold text-teal-600">{bookedAppointment.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-sm space-y-4">
                    {/* Patient detail row */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-gray-200/60 pb-3">
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Patient Name</span>
                        <p className="font-semibold text-slate-800">{bookedAppointment.patientName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Phone Number</span>
                        <p className="font-semibold text-slate-800">{bookedAppointment.patientPhone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Registered Email</span>
                        <p className="font-semibold text-slate-800 truncate">{bookedAppointment.patientEmail}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Status</span>
                        <p className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Confirmed
                        </p>
                      </div>
                    </div>

                    {/* Medical details row */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Specialist Consultant</p>
                          <p className="font-semibold text-slate-800">
                            {confirmedDoc?.name} <span className="text-xs text-slate-500">({confirmedDoc?.degree})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Location / Wing</p>
                          <p className="font-semibold text-slate-800">
                            {confirmedDept?.name} — {confirmedDept?.roomNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Scheduled Time</p>
                          <p className="font-semibold text-slate-800">
                            {new Date(bookedAppointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-slate-500">{bookedAppointment.timeSlot}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 text-center leading-relaxed">
                    Please arrive 15 minutes before your scheduled slot. Bring along previous clinical reports, medical prescriptions, and insurance details. If you need to cancel or reschedule, visit the "My Appointments" tab.
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer w-full text-center"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
