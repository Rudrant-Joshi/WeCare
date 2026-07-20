import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Baby, Activity, Bone, Shield, Sparkles, 
  Stethoscope, Phone, MapPin, CheckCircle, ArrowRight, 
  Calendar, Star, ChevronRight, UserRound 
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor } from '../types';
import ScrollAnimate, { StaggerContainer, StaggerItem } from './ScrollAnimate';

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
      <ScrollAnimate variant="fadeUp">
        <div className="mb-12 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Clinical Roster</span>
          <h1 className="font-sans font-extrabold text-4xl text-slate-900 tracking-tight">Our Medical Departments</h1>
          <p className="text-slate-500 text-sm max-w-2xl">
            WeCare maintains fully equipped specialty wards operating under certified hygiene and medical supervision protocols. Explore services and active specialist clinicians.
          </p>
        </div>
      </ScrollAnimate>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Department Selector Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3 px-1">
            Choose Specialty ({DEPARTMENTS.length})
          </p>
          <div className="flex flex-row lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2 shrink-0 scrollbar-none">
            {DEPARTMENTS.map((dept, idx) => {
              const isActive = dept.id === selectedDeptId;
              return (
                <motion.button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  whileHover={{ scale: isActive ? 1 : 1.02, x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all duration-200 cursor-pointer shrink-0 min-w-[220px] lg:min-w-0 ${
                    isActive 
                      ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100' 
                      : 'bg-white border-gray-150 text-slate-700 hover:bg-slate-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/10 text-white' : 'bg-teal-50 text-teal-600'} icon-hover-bounce`}>
                    {getIcon(dept.iconName, "w-5 h-5")}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{dept.name}</h3>
                    <p className={`text-[10px] mt-0.5 ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                      {DOCTORS.filter(d => d.departmentId === dept.id).length} Expert Doctors
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Department Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDept.id}
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 space-y-8 shadow-sm"
              id="department-details-card"
            >
              {/* Dept Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 icon-hover-rotate"
                  >
                    {getIcon(activeDept.iconName, "w-7 h-7")}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{activeDept.name} Department</h2>
                    <p className="text-xs text-slate-400 mt-0.5">WeCare Specialized Medical Services</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => onSelectDepartmentForBooking(activeDept.id)}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-shine"
                >
                  <Calendar className="w-4 h-4 text-teal-200" />
                  Book in {activeDept.name}
                </motion.button>
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
                      <motion.li 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        className="flex items-start gap-2.5 text-xs text-slate-600 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Ward Locations & Direct Phone Extension */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between card-hover-sm"
                >
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
                        <a href={`tel:${activeDept.contactPhone.replace(/\D/g, '')}`} className="text-xs font-bold text-slate-800 hover:text-teal-600 transition-colors link-hover-underline">
                          {activeDept.contactPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-3 border-t border-gray-200/60 leading-relaxed italic">
                    Emergency triage admissions are accepted directly without token scheduling via Wing A ambulance decks.
                  </p>
                </motion.div>
              </div>

              {/* Specialists Attached */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <UserRound className="w-4 h-4 text-teal-500" />
                  Specialist Clinicians in {activeDept.name} ({deptDoctors.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptDoctors.map((doc, idx) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * idx, duration: 0.35 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="p-4 bg-white rounded-xl border border-gray-150 hover:border-teal-200 transition-colors flex items-center justify-between card-hover-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${doc.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                          {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{doc.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">{doc.role} • {doc.degree}</p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                            {doc.rating}
                          </div>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => onSelectDoctorForBooking(doc.id)}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                        title="Book Consultation"
                      >
                        <Calendar className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
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
