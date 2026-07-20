import React, { useState } from 'react';
import { 
  Shield, Calendar, Clock, User as UserIcon, Phone, Mail, FileText, 
  MapPin, Check, CheckCircle2, AlertCircle, Search, PlusCircle, Trash2, Edit2, 
  X, Filter, RefreshCw, Layers, Sparkles, SlidersHorizontal, Eye
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Appointment, User } from '../types';

interface AdminPortalViewProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  currentUser: User | null;
}

export default function AdminPortalView({
  appointments,
  onAddAppointment,
  onCancelAppointment,
  onUpdateAppointment,
  currentUser
}: AdminPortalViewProps) {
  // Defensive check for non-admins
  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'rudrant.joshi@gmail.com';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // New Booking State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]?.id || '');
  const [newDoc, setNewDoc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'Confirmed' | 'Pending' | 'Completed'>('Confirmed');
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingApp, setEditingApp] = useState<Appointment | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editDoc, setEditDoc] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<'Confirmed' | 'Pending' | 'Completed'>('Confirmed');
  const [editError, setEditError] = useState('');

  // Default doctor select when department changes
  React.useEffect(() => {
    const docs = DOCTORS.filter(d => d.departmentId === newDept);
    if (docs.length > 0) {
      setNewDoc(docs[0].id);
    } else {
      setNewDoc('');
    }
  }, [newDept]);

  React.useEffect(() => {
    if (editingApp) {
      const docs = DOCTORS.filter(d => d.departmentId === editDept);
      if (docs.length > 0 && !docs.some(d => d.id === editDoc)) {
        setEditDoc(docs[0].id);
      }
    }
  }, [editDept]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center" id="admin-forbidden">
        <div className="bg-white rounded-3xl border border-rose-100 p-10 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest font-mono">Restricted Access</span>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 tracking-tight">Access Denied</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              The credentials you provided do not possess administrator rights. Please sign in with an authorised clinical administrative account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

  // Filter list
  const filteredAppointments = appointments.filter(app => {
    const searchString = `${app.patientName} ${app.patientEmail} ${app.patientPhone} ${app.id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDept = deptFilter === 'all' || app.departmentId === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim() || !newDate || !newTime || !newDept || !newDoc) {
      setFormError('Please fill in all required fields marked with *');
      return;
    }

    const newAppointment: Appointment = {
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: newName.trim(),
      patientEmail: newEmail.toLowerCase().trim(),
      patientPhone: newPhone.trim(),
      departmentId: newDept,
      doctorId: newDoc,
      date: newDate,
      timeSlot: newTime,
      notes: newNotes.trim(),
      status: newStatus,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newAppointment);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewDate('');
    setNewTime('');
    setNewNotes('');
    setNewStatus('Confirmed');
    setFormError('');
    setIsAddOpen(false);
  };

  const handleStartEdit = (app: Appointment) => {
    setEditingApp(app);
    setEditName(app.patientName);
    setEditPhone(app.patientPhone);
    setEditEmail(app.patientEmail);
    setEditDept(app.departmentId);
    setEditDoc(app.doctorId);
    setEditDate(app.date);
    setEditTime(app.timeSlot);
    setEditNotes(app.notes || '');
    setEditStatus(app.status);
    setEditError('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    if (!editName.trim() || !editEmail.trim() || !editPhone.trim() || !editDate || !editTime) {
      setEditError('Please fill in all required fields.');
      return;
    }

    const updated: Appointment = {
      ...editingApp,
      patientName: editName.trim(),
      patientEmail: editEmail.toLowerCase().trim(),
      patientPhone: editPhone.trim(),
      departmentId: editDept,
      doctorId: editDoc,
      date: editDate,
      timeSlot: editTime,
      notes: editNotes.trim(),
      status: editStatus
    };

    onUpdateAppointment(updated);
    setEditingApp(null);
  };

  const updateStatusDirectly = (app: Appointment, nextStatus: 'Confirmed' | 'Pending' | 'Completed') => {
    onUpdateAppointment({
      ...app,
      status: nextStatus
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="admin-dashboard-container">
      {/* Header section with theme colors */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E8E6E1] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#5F7A61] mb-1">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Administrative Workspace</span>
          </div>
          <h1 className="font-sans font-extrabold text-3xl text-[#2D332D] tracking-tight">Clinical Control Panel</h1>
          <p className="text-sm text-[#6A706A]">
            Overview of clinical slots, patient registrations, scheduling modifications, and reservation approvals.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 bg-[#5F7A61] text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-[#4D634F] transition-all cursor-pointer text-sm"
            id="btn-admin-add-booking"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            Schedule New Booking
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-metrics-grid">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#9DA39D] uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-extrabold text-[#2D332D]">{total}</p>
          </div>
          <div className="w-10 h-10 bg-[#FAF9F6] text-[#7D827D] rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#9DA39D] uppercase tracking-wider">Pending Approval</p>
            <p className="text-2xl font-extrabold text-[#D4A373]">{pending}</p>
          </div>
          <div className="w-10 h-10 bg-[#FAF9F6] text-[#D4A373] rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#9DA39D] uppercase tracking-wider">Confirmed Slots</p>
            <p className="text-2xl font-extrabold text-[#5F7A61]">{confirmed}</p>
          </div>
          <div className="w-10 h-10 bg-[#E8F0E9] text-[#5F7A61] rounded-xl flex items-center justify-center">
            <Check className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E6E1] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#9DA39D] uppercase tracking-wider">Completed Sessions</p>
            <p className="text-2xl font-extrabold text-emerald-700">{completed}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Filter & List Section */}
      <div className="bg-white rounded-3xl border border-[#E8E6E1] overflow-hidden shadow-sm" id="admin-table-container">
        {/* Dynamic Controls Header */}
        <div className="p-6 bg-[#FAF9F6] border-b border-[#E8E6E1] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-[#2D332D] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#5F7A61]" />
              Interactive Roster Filters
            </h3>
            <span className="text-xs font-semibold text-[#5F7A61] bg-[#E8F0E9] px-2.5 py-1 rounded-full">
              Showing {filteredAppointments.length} of {total} Appointments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9DA39D]" />
              <input
                type="text"
                placeholder="Search patient name, email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E8E6E1] rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#5F7A61] transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E8E6E1] rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-[#9DA39D] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-[#3D403D] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Approval</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-[#E8E6E1] rounded-xl px-3 py-2">
              <Layers className="w-3.5 h-3.5 text-[#9DA39D] shrink-0" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-[#3D403D] cursor-pointer"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List/Table */}
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-[#7D827D] space-y-3 bg-white" id="admin-empty-state">
            <Calendar className="w-12 h-12 text-[#DEDCD7] mx-auto" />
            <h4 className="font-bold text-[#2D332D]">No Matching Bookings</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any appointment records matching your search queries or filter attributes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-[#7D827D] uppercase tracking-wider">
                  <th className="px-6 py-4">ID & Patient</th>
                  <th className="px-6 py-4">Medical Specialist</th>
                  <th className="px-6 py-4">Clinical Slot</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAppointments.map((app) => {
                  const dept = DEPARTMENTS.find(d => d.id === app.departmentId);
                  const doc = DOCTORS.find(d => d.id === app.doctorId);

                  return (
                    <tr key={app.id} className="hover:bg-[#FAF9F6] transition-colors" id={`row-app-${app.id}`}>
                      {/* Patient info */}
                      <td className="px-6 py-4.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#5F7A61] bg-[#E8F0E9] px-1.5 py-0.5 rounded">
                            {app.id}
                          </span>
                          <span className="font-bold text-slate-900">{app.patientName}</span>
                        </div>
                        <div className="space-y-0.5 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{app.patientEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{app.patientPhone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Specialist Info */}
                      <td className="px-6 py-4.5">
                        <p className="font-bold text-[#3D403D]">{doc?.name || 'Unassigned Doctor'}</p>
                        <p className="text-xs text-slate-400">{dept?.name || 'General Clinical'}</p>
                      </td>

                      {/* Timing slot */}
                      <td className="px-6 py-4.5 space-y-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-[#5F7A61]" />
                          <span>{app.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{app.timeSlot}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          app.status === 'Confirmed'
                            ? 'bg-[#E8F0E9] text-[#5F7A61]'
                            : app.status === 'Pending'
                            ? 'bg-[#FDF6ED] text-[#D4A373]'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {app.status}
                        </span>
                      </td>

                      {/* Notes snippet */}
                      <td className="px-6 py-4.5 max-w-[150px]">
                        <p className="text-xs text-slate-400 truncate" title={app.notes}>
                          {app.notes || <span className="italic text-slate-300">No notes provided</span>}
                        </p>
                      </td>

                      {/* Management Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Quick confirmation */}
                          {app.status === 'Pending' && (
                            <button
                              onClick={() => updateStatusDirectly(app, 'Confirmed')}
                              title="Confirm Reservation"
                              className="p-1.5 bg-[#E8F0E9] hover:bg-[#D1E2D4] text-[#5F7A61] rounded-lg transition-colors cursor-pointer"
                              id={`action-confirm-${app.id}`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick complete */}
                          {app.status === 'Confirmed' && (
                            <button
                              onClick={() => updateStatusDirectly(app, 'Completed')}
                              title="Mark Session Completed"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                              id={`action-complete-${app.id}`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Details */}
                          <button
                            onClick={() => handleStartEdit(app)}
                            title="Edit Details"
                            className="p-1.5 bg-white border border-[#E8E6E1] text-[#7D827D] hover:text-[#5F7A61] hover:border-[#5F7A61] rounded-lg transition-colors cursor-pointer"
                            id={`action-edit-${app.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Slot */}
                          <button
                            onClick={() => onCancelAppointment(app.id)}
                            title="Delete Slot"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            id={`action-delete-${app.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overlay modal for adding a new booking */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#E8E6E1] shadow-2xl text-left" id="admin-add-modal">
            <div className="bg-[#5F7A61] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-white/80">Administrative Tool</span>
                <h3 className="font-sans font-bold text-xl">Schedule Reservation Slot</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. pat@example.com"
                  className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Department *</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Clinical Specialist *</label>
                  <select
                    value={newDoc}
                    onChange={(e) => setNewDoc(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    {DOCTORS.filter(d => d.departmentId === newDept).map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Time Slot *</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    <option value="">Select slot</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Initial Reservation Status</label>
                  <div className="flex gap-4 pt-1">
                    {['Pending', 'Confirmed', 'Completed'].map((st) => (
                      <label key={st} className="flex items-center gap-1.5 text-xs text-[#3D403D] cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="newStatus"
                          value={st}
                          checked={newStatus === st}
                          onChange={() => setNewStatus(st as any)}
                          className="accent-[#5F7A61]"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Notes / Symptoms</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Heart rate tracking or routine checkup"
                  rows={2}
                  className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 bg-white border border-[#E8E6E1] text-[#3D403D] font-bold py-2.5 rounded-xl text-xs hover:bg-[#FAF9F6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#5F7A61] hover:bg-[#4D634F] text-white font-bold py-2.5 rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay modal for editing an existing booking */}
      {editingApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingApp(null)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-[#E8E6E1] shadow-2xl text-left" id="admin-edit-modal">
            <div className="bg-[#5F7A61] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-white/80">Management Tool</span>
                <h3 className="font-sans font-bold text-xl">Modify Consultation Details</h3>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Phone</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Department</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Clinical Specialist</label>
                  <select
                    value={editDoc}
                    onChange={(e) => setEditDoc(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    {DOCTORS.filter(d => d.departmentId === editDept).map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#7D827D] uppercase">Time Slot</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#7D827D] uppercase font-semibold">Reservation Status</label>
                <div className="flex gap-4 pt-1">
                  {['Pending', 'Confirmed', 'Completed'].map((st) => (
                    <label key={st} className="flex items-center gap-1.5 text-xs text-[#3D403D] cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="editStatus"
                        value={st}
                        checked={editStatus === st}
                        onChange={() => setEditStatus(st as any)}
                        className="accent-[#5F7A61]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#7D827D] uppercase">Patient Notes / Symptoms</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Additional patient directives"
                  rows={2}
                  className="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5F7A61] resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="flex-1 bg-white border border-[#E8E6E1] text-[#3D403D] font-bold py-2.5 rounded-xl text-xs hover:bg-[#FAF9F6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D4A373] text-white font-bold py-2.5 rounded-xl text-xs shadow-md hover:brightness-110 cursor-pointer"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
