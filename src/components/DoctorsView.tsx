import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Calendar, ArrowRight, X, Mail, Landmark, BookOpen, HeartPulse, Check } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { Doctor } from '../types';

interface DoctorsViewProps {
  onSelectDoctorForBooking: (doctorId: string) => void;
}

export default function DoctorsView({ onSelectDoctorForBooking }: DoctorsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Filter Doctors dynamically based on search term and selected department
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDeptFilter]);

  const activeDeptForModal = selectedDoctor 
    ? DEPARTMENTS.find(d => d.id === selectedDoctor.departmentId) 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left" id="doctors-view">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Medical Specialists</span>
        <h1 className="font-sans font-extrabold text-4xl text-slate-900 tracking-tight">Meet Our Expert Clinicians</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          Search and learn more about our board-certified clinical faculty. Select a profile to view academic background, clinical research interests, and routine consulting days.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-8 border border-slate-150 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors by name, role, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pill Tabs */}
        <div className="w-full md:w-auto overflow-x-auto flex gap-1.5 scrollbar-none pb-2 md:pb-0">
          <button
            onClick={() => setSelectedDeptFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
              selectedDeptFilter === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-gray-300'
            }`}
          >
            All Specialties
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptFilter(dept.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                selectedDeptFilter === dept.id
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-gray-300'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="doctors-roster-grid">
          {filteredDoctors.map((doc) => {
            const dept = DEPARTMENTS.find(d => d.id === doc.departmentId);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-teal-200 transition-all group cursor-pointer"
                onClick={() => setSelectedDoctor(doc)}
                id={`doctor-card-${doc.id}`}
              >
                {/* Avatar Banner Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-center gap-4.5">
                    {/* Stylized custom medical monogram or AI photo */}
                    {doc.imageUrl ? (
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm shadow-slate-100"
                        id={`doctor-avatar-img-${doc.id}`}
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${doc.avatarColor} text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm shadow-slate-100`} id={`doctor-avatar-initials-${doc.id}`}>
                        {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <h3 className="font-sans font-bold text-sm text-slate-900 group-hover:text-teal-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-teal-600 font-semibold">{doc.role}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{dept?.name} • {doc.degree}</p>
                    </div>
                  </div>
                </div>

                {/* Experience & Rating Summary */}
                <div className="px-5 pb-5 space-y-4">
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {doc.bio}
                  </p>

                  {/* Rating / Experience Row */}
                  <div className="flex items-center justify-between text-[11px] border-y border-gray-100 py-2">
                    <span className="text-slate-400 font-medium">Experience: <strong className="text-slate-700">{doc.experienceYears} Years</strong></span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {doc.rating}
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1">
                    {doc.specialties.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-600 text-[9px] px-2 py-0.5 rounded font-medium border border-slate-100">
                        {s}
                      </span>
                    ))}
                    {doc.specialties.length > 2 && (
                      <span className="text-slate-400 text-[9px] font-medium py-0.5 px-1">
                        +{doc.specialties.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Quick Profile Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Clinical Profile
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Stop parent click (which triggers modal)
                        onSelectDoctorForBooking(doc.id);
                      }}
                      className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors cursor-pointer"
                      title="Schedule Slot"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty search state */
        <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-base">No Medical Experts Found</h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              We couldn't find any doctor matching "{searchTerm}" under {selectedDeptFilter === 'all' ? 'all departments' : 'this specialty'}. Please double-check spelling or try selecting another department.
            </p>
          </div>
          <button
            onClick={() => { setSearchTerm(''); setSelectedDeptFilter('all'); }}
            className="inline-flex items-center justify-center text-xs font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reset Search filters
          </button>
        </div>
      )}

      {/* Doctor Detailed Clinical Profile Modal */}
      {selectedDoctor && activeDeptForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedDoctor(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal content block */}
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Academic & Clinical Profile</h2>
                <p className="text-[11px] text-slate-500">Board-certified WeCare Consultant Profile</p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Monogram card or AI photo */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {selectedDoctor.imageUrl ? (
                  <img
                    src={selectedDoctor.imageUrl}
                    alt={selectedDoctor.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md"
                    id={`selected-doctor-avatar-img-${selectedDoctor.id}`}
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedDoctor.avatarColor} text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md`} id={`selected-doctor-avatar-initials-${selectedDoctor.id}`}>
                    {selectedDoctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-teal-600 font-semibold">{selectedDoctor.role}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activeDeptForModal.name} Ward • {selectedDoctor.degree}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      Experience: {selectedDoctor.experienceYears} Years
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500 stroke-none" />
                      {selectedDoctor.rating} (Patient Rating)
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Clinician Biography</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedDoctor.bio}</p>
              </div>

              {/* Grid split: Education vs Specialties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div className="space-y-3 bg-slate-50 p-4.5 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-indigo-500" />
                    Academic Credentials
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedDoctor.education.map((edu, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties list */}
                <div className="space-y-3 bg-slate-50 p-4.5 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-500" />
                    Clinical Specializations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedDoctor.specialties.map((spec, idx) => (
                      <li key={idx} className="flex gap-2 items-center">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Schedule and Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-5 text-xs text-slate-600">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">In-Clinic Schedule</p>
                  <p className="font-semibold text-slate-800">
                    Every {selectedDoctor.schedule.join(', ')}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">Office Communications</p>
                  <a 
                    href={`mailto:${selectedDoctor.email}`} 
                    className="font-semibold text-teal-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {selectedDoctor.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-white rounded-xl text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  const docId = selectedDoctor.id;
                  setSelectedDoctor(null);
                  onSelectDoctorForBooking(docId);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-200" />
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
