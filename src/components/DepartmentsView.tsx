import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Baby, Activity, Bone, Shield, Sparkles, 
  Stethoscope, Phone, MapPin, CheckCircle, ArrowRight, 
  Calendar, Star, ChevronRight, UserRound 
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor } from '../types';

interface DepartmentsViewProps {
  onSelectDepartmentForBooking: (departmentId: string) => void;
  onSelectDoctorForBooking: (doctorId: string) => void;
}

// Map strings to Icon Components
const getIcon = (name: string, className = "w-6 h-6") => {
  switch (name) {
    case 'Heart': return <Heart className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Bone': return <Bone className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    default: return <Stethoscope className={className} />;
  }
};

export default function DepartmentsView({
  onSelectDepartmentForBooking,
  onSelectDoctorForBooking
}: DepartmentsViewProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const deptDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDeptId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left" id="departments-view">
      {/* Header */}
      <div className="mb-12 space-y-3">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Clinical Roster</span>
        <h1 className="font-sans font-extrabold text-4xl text-slate-900 tracking-tight">Our Medical Departments</h1>
        <p className="text-slate-500 text-sm max-w-2xl">
          WeCare maintains fully equipped specialty wards operating under certified hygiene and medical supervision protocols. Explore services and active specialist clinicians.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Department Selector Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3 px-1">
            Choose Specialty ({DEPARTMENTS.length})
          </p>
          <div className="flex flex-row lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2 shrink-0 scrollbar-none">
            {DEPARTMENTS.map((dept) => {
              const isActive = dept.id === selectedDeptId;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all duration-200 cursor-pointer shrink-0 min-w-[220px] lg:min-w-0 ${
                    isActive 
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100' 
                      : 'bg-white border-gray-150 text-slate-700 hover:bg-slate-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/10 text-white' : 'bg-teal-50 text-teal-600'}`}>
                    {getIcon(dept.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{dept.name}</h3>
                    <p className={`text-[10px] mt-0.5 ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                      {DOCTORS.filter(d => d.departmentId === dept.id).length} Expert Doctors
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Department Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDept.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-8 shadow-sm"
              id="department-details-card"
            >
              {/* Dept Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                    {getIcon(activeDept.iconName, "w-7 h-7")}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{activeDept.name} Department</h2>
                    <p className="text-xs text-slate-400 mt-0.5">WeCare Specialized Medical Services</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onSelectDepartmentForBooking(activeDept.id)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-teal-200" />
                  Book in {activeDept.name}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Overview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{activeDept.description}</p>
              </div>

              {/* Services & Support Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                {/* Services Checklist */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Offered Clinical Services</h3>
                  <ul className="space-y-2.5">
                    {activeDept.services.map((service, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                        <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ward Locations & Direct Phone Extension */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Ward & Logistics</h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Clinic Location</p>
                        <p className="text-xs font-bold text-slate-800">{activeDept.roomNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Direct Nursing Station</p>
                        <a href={`tel:${activeDept.contactPhone.replace(/\D/g, '')}`} className="text-xs font-bold text-slate-800 hover:text-teal-600 transition-colors">
                          {activeDept.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-3 border-t border-gray-200/60 leading-relaxed italic">
                    Emergency triage admissions are accepted directly without token scheduling via Wing A ambulance decks.
                  </p>
                </div>
              </div>

              {/* Specialists Attached */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <UserRound className="w-4 h-4 text-teal-500" />
                  Specialist Clinicians in {activeDept.name} ({deptDoctors.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptDoctors.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-4 bg-white rounded-xl border border-gray-150 hover:border-teal-200 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${doc.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                          {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{doc.role} • {doc.degree}</p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                            {doc.rating}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectDoctorForBooking(doc.id)}
                        className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                        title="Book Consultation"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
