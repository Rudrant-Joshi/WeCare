import React, { useState } from 'react';
import { 
  Calendar, Clock, User as UserIcon, Phone, Mail, FileText, 
  MapPin, XCircle, Edit, Trash2, CheckCircle, Search, 
  ChevronRight, CalendarCheck, AlertCircle, Save, Lock, LogIn 
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Appointment, User } from '../types';

interface BookingsViewProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onOpenBooking: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function BookingsView({
  appointments,
  onCancelAppointment,
  onUpdateAppointment,
  onOpenBooking,
  currentUser,
  onOpenAuth
}: BookingsViewProps) {
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);
  const [cancellingAppId, setCancellingAppId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" id="bookings-auth-gate">
        <div className="bg-white rounded-3xl border border-[#E8E6E1] p-10 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-[#E8F0E9] text-[#5F7A61] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#5F7A61] uppercase tracking-widest font-mono">WeCare Patient Portal</span>
            <h2 className="font-sans font-extrabold text-2xl text-[#2D332D] tracking-tight">Access Secure Portal</h2>
            <p className="text-[#6A706A] text-sm leading-relaxed">
              Please sign in or register a new patient account to review, schedule, and coordinate your clinical consultation appointments.
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full bg-[#5F7A61] hover:bg-[#4D634F] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            id="btn-portal-signin"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Patient Portal
          </button>
          <p className="text-[11px] text-[#9DA39D]">
            Secure TLS 1.3 Encryption Active • HIPAA-Compliant System
          </p>
        </div>
      </div>
    );
  }

  // Filter appointments for the current user
  const myAppointments = appointments.filter(
    app => app.patientEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  // Trigger edit mode
  const startEdit = (app: Appointment) => {
    setEditingApp(app);
    setEditName(app.patientName);
    setEditPhone(app.patientPhone);
    setEditEmail(app.patientEmail);
    setEditDate(app.date);
    setEditTime(app.timeSlot);
    setEditNotes(app.notes || '');
    setEditErrors({});
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Save edit changes
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    // Validate fields
    const tempErrors: { [key: string]: string } = {};
    if (!editName.trim()) tempErrors.name = 'Patient name is required';
    if (!editPhone.trim()) {
      tempErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(editPhone)) {
      tempErrors.phone = 'Provide a valid phone';
    }

    if (!editEmail.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editEmail)) {
      tempErrors.email = 'Provide a valid email';
    }
    
    if (!editDate) tempErrors.date = 'Date is required';
    if (!editTime) tempErrors.time = 'Time slot is required';

    if (Object.keys(tempErrors).length > 0) {
      setEditErrors(tempErrors);
      return;
    }

    const updated: Appointment = {
      ...editingApp,
      patientName: editName.trim(),
      patientPhone: editPhone.trim(),
      patientEmail: editEmail.trim(),
      date: editDate,
      timeSlot: editTime,
      notes: editNotes.trim() || undefined
    };

    onUpdateAppointment(updated);
    setEditingApp(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left" id="bookings-view">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">My Medical Portal</span>
        <h1 className="font-sans font-extrabold text-4xl text-slate-900 tracking-tight">Your Consultations</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Review, edit, or cancel active appointments at WeCare Hospitals. Keep track of room codes and check consult times below.
        </p>
      </div>

      {myAppointments.length > 0 ? (
        <div className="space-y-6" id="bookings-list">
          {myAppointments.map((app) => {
            const dept = DEPARTMENTS.find((d) => d.id === app.departmentId);
            const doc = DOCTORS.find((d) => d.id === app.doctorId);

            return (
              <div 
                key={app.id}
                className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                id={`booking-card-${app.id}`}
              >
                {/* Status indicator pill top right */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Confirmed Slot
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Doctor/Dept Metadata */}
                  <div className="md:col-span-4 space-y-4 pr-0 md:pr-4 md:border-r border-gray-100">
                    <div className="flex items-center gap-3">
                      {doc?.imageUrl ? (
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm"
                          id={`booking-doctor-avatar-img-${doc.id}`}
                        />
                      ) : (
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${doc?.avatarColor || 'from-teal-400 to-teal-500'} text-white font-bold text-sm flex items-center justify-center shrink-0`} id={`booking-doctor-avatar-initials-${doc?.id || 'default'}`}>
                          {doc ? doc.name.split(' ').slice(1).map(n => n[0]).join('') : 'DR'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-sans font-bold text-slate-900 text-sm leading-tight">
                          {doc?.name || 'Specialist Clinician'}
                        </h3>
                        <p className="text-[11px] text-teal-600 font-semibold mt-0.5">{doc?.role}</p>
                        <p className="text-[10px] text-slate-400">{dept?.name} • {doc?.degree}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{dept?.roomNumber || 'Triage Ward'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <CalendarCheck className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">Ref: {app.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Patient & Consultation Date */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Consultation Schedule</p>
                      <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                        <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>
                          {new Date(app.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 pl-6">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{app.timeSlot}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Patient Details</p>
                      <p className="font-medium text-slate-800">
                        Name: <span className="text-slate-600">{app.patientName}</span>
                      </p>
                      <p>
                        Phone: <span className="text-slate-600 font-mono">{app.patientPhone}</span>
                      </p>
                      <p className="truncate">
                        Email: <span className="text-slate-600">{app.patientEmail}</span>
                      </p>
                      {app.notes && (
                        <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 italic leading-relaxed mt-2 max-w-sm line-clamp-2">
                          "{app.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button
                      onClick={() => startEdit(app)}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl border border-gray-150 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    <button
                      onClick={() => setCancellingAppId(app.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold hover:bg-red-50 text-red-600 py-2.5 px-4 rounded-xl border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Cancel Slot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty bookings roster */
        <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center max-w-md mx-auto space-y-5">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto shadow-inner">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold text-lg">No Active Appointments</h3>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              You haven't scheduled any consultation slots with our medical experts yet. Choose a department or specialist doctor to reserve a clinic appointment.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 text-xs font-bold bg-teal-600 text-white px-6 py-3.5 rounded-xl hover:bg-teal-700 transition-transform hover:-translate-y-0.5 shadow-md shadow-teal-100 cursor-pointer"
          >
            Schedule Consultation Now
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Edit Booking Dialog Overlay */}
      {editingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setEditingApp(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Modify Consultation Details</h3>
                <p className="text-[10px] text-slate-400">Reference: {editingApp.id}</p>
              </div>
              <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={saveEdit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none"
                />
                {editErrors.name && <p className="text-red-500 text-[10px] mt-1">{editErrors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none font-mono"
                />
                {editErrors.phone && <p className="text-red-500 text-[10px] mt-1">{editErrors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none"
                />
                {editErrors.email && <p className="text-red-500 text-[10px] mt-1">{editErrors.email}</p>}
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none"
                  />
                  {editErrors.date && <p className="text-red-500 text-[10px] mt-1">{editErrors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Midday (12:00 PM - 2:00 PM)">Midday (12:00 PM - 2:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                  </select>
                  {editErrors.time && <p className="text-red-500 text-[10px] mt-1">{editErrors.time}</p>}
                </div>
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Symptoms / Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Cancellation Dialog */}
      {cancellingAppId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setCancellingAppId(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 z-10 border border-gray-100 space-y-4">
            <div className="w-11 h-11 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">Cancel Clinical Consultation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel appointment <strong className="text-slate-700 font-mono">{cancellingAppId}</strong>? This action is irreversible and releases this specialist's slot immediately.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setCancellingAppId(null)}
                className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-xl text-slate-600 cursor-pointer"
              >
                No, Keep Slot
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(cancellingAppId);
                  setCancellingAppId(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
