import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Baby, Activity, Bone, Shield, Sparkles, 
  Stethoscope, Calendar, Award, Clock, HeartPulse, 
  ChevronRight, ArrowRight, Star, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { DEPARTMENTS, DOCTORS, TESTIMONIALS, HEALTH_TIPS } from '../data';
import { Department, Doctor, HealthTip } from '../types';

interface HomeViewProps {
  setTab: (tab: string) => void;
  onOpenBooking: () => void;
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

export default function HomeView({ setTab, onOpenBooking, onSelectDoctorForBooking }: HomeViewProps) {
  // Take 3 high-rated doctors for highlight
  const featuredDoctors = DOCTORS.filter(doc => doc.rating >= 4.9).slice(0, 3);

  // Take the 3 latest health tips
  const latestTips = HEALTH_TIPS.slice(0, 3);

  return (
    <div className="space-y-24 pb-20" id="home-view">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/10 pt-10 pb-20 md:py-28">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 text-teal-700 text-xs font-semibold uppercase tracking-wider"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Your Health, Our Sacred Mission
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight"
              >
                World-Class Healthcare, <br />
                <span className="text-teal-600 relative inline-block">
                  Delivered with Care
                  <svg className="absolute left-0 bottom-0.5 h-2 w-full text-teal-200/65 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-lg leading-relaxed max-w-xl"
              >
                WeCare Hospitals brings together leading clinical specialists, state-of-the-art diagnostics, and empathetic care to secure a healthier tomorrow for you and your family.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <button
                  onClick={onOpenBooking}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-teal-100 transition-all hover:shadow-teal-200 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  Book Appointment
                  <Calendar className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTab('departments')}
                  className="bg-white hover:bg-slate-50 border border-gray-200 text-slate-800 font-medium px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-gray-300"
                >
                  Explore Specialties
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </motion.div>

              {/* Stats Highlights */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200/60"
              >
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900 font-sans">150+</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Expert Doctors</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900 font-sans">15k+</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Happy Patients</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-slate-900 font-sans">99.4%</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Success Rate</p>
                </div>
              </motion.div>
            </div>

            {/* Visual Hero Image Card / Showcase Column */}
            <div className="lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl bg-teal-600 p-8 text-white shadow-2xl shadow-teal-900/10 overflow-hidden min-h-[420px] flex flex-col justify-between"
              >
                {/* Decorative glow */}
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500 rounded-full blur-2xl opacity-40" />
                <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500 rounded-full blur-2xl opacity-40" />
                
                {/* Visual Accent header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-tight">Main Campus Clinic</h3>
                      <p className="text-[10px] text-teal-100">Verified Health Partner</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-500/80 text-white font-bold py-1 px-2.5 rounded-full">
                    ● ACTIVE
                  </span>
                </div>

                {/* Patient Case Center */}
                <div className="relative z-10 my-8 space-y-6">
                  <p className="text-lg font-medium leading-relaxed italic text-teal-50">
                    "WeCare Doctors diagnosed my cardiac condition quickly and designed a rehabilitation program that restored my strength. I am deeply grateful."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-700 font-bold text-sm flex items-center justify-center border border-white/25">
                      JR
                    </div>
                    <div>
                      <p className="text-sm font-semibold">James Reynolds</p>
                      <p className="text-xs text-teal-200">Rehabilitation Program Graduate</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Foot */}
                <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-teal-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-teal-200" />
                    Admissions Open 24/7
                  </span>
                  <a href="tel:+15551012000" className="text-white hover:underline font-bold flex items-center gap-1">
                    Call Center
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>

              {/* Float diagnostic badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Joint Commission Approved</h5>
                  <p className="text-[10px] text-slate-400">National Healthcare Gold Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Clinical Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Why Choose WeCare</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Our Commitment to Clinical Excellence
          </h2>
          <p className="text-slate-500 text-sm">
            We are dedicated to maintaining the highest clinical standards across diagnosis, therapeutics, and client experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-6.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-gray-200">
            <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-5">
              <Stethoscope className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-slate-950 font-bold text-base mb-2">Qualified Specialists</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our clinical faculty includes board-certified practitioners holding degrees from top national institutes.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-gray-200">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5">
              <Activity className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-slate-950 font-bold text-base mb-2">Advanced Diagnostics</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We operate high-resolution MRI, multi-slice CT, digital pathology, and cutting-edge genetic testing kits.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-6.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-gray-200">
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-slate-950 font-bold text-base mb-2">24/7 Emergency Wing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our dedicated trauma and triage physicians are available 24 hours to address critical situations instantly.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-6.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-gray-200">
            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-5">
              <HeartPulse className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-slate-950 font-bold text-base mb-2">Empathetic Patient Care</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We design specialized rehabilitation, post-surgical recovery boards, and patient support networks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Departments Grid Preview */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Our Specialties</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Our Medical Departments
              </h2>
            </div>
            <button
              onClick={() => setTab('departments')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold text-sm cursor-pointer group"
            >
              View all departments
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.slice(0, 3).map((dept) => (
              <div 
                key={dept.id}
                className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-6 text-left">
                  <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                    {getIcon(dept.iconName)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{dept.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{dept.description}</p>
                  
                  {/* Service list highlights */}
                  <ul className="space-y-1.5">
                    {dept.services.slice(0, 3).map((service, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{dept.roomNumber}</span>
                  <button
                    onClick={() => setTab('departments')}
                    className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1"
                  >
                    Services & Doctors
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Highlighted Doctors / Specialists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Meet Our Leaders</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Our Expert Medical Specialists
            </h2>
          </div>
          <button
            onClick={() => setTab('doctors')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold text-sm cursor-pointer group"
          >
            Meet the entire team
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDoctors.map((doc) => {
            const dept = DEPARTMENTS.find(d => d.id === doc.departmentId);
            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group text-left"
              >
                {/* Visual Avatar Block with background gradient or AI photo */}
                <div className="p-6 pb-4 flex items-center gap-4">
                  {doc.imageUrl ? (
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-md"
                      id={`featured-doctor-avatar-img-${doc.id}`}
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doc.avatarColor} text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md`} id={`featured-doctor-avatar-initials-${doc.id}`}>
                      {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h3 className="font-sans font-bold text-base text-slate-900 group-hover:text-teal-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-teal-600 font-semibold">{doc.role}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{dept?.name} • {doc.degree}</p>
                  </div>
                </div>

                {/* Info and action */}
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>
                  
                  {/* Rating / Experience */}
                  <div className="flex items-center justify-between text-xs border-y border-gray-100 py-2">
                    <span className="text-slate-400 font-medium">Experience: <strong className="text-slate-700">{doc.experienceYears} Years</strong></span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {doc.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDoctorForBooking(doc.id)}
                      className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-2 px-3 rounded-xl text-xs text-center transition-colors cursor-pointer"
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => setTab('doctors')}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-2 px-3 rounded-xl text-xs text-center transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Patient Testimonials Carousel / Grid */}
      <section className="bg-slate-900 text-white py-20 overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest font-mono">Patient Feedback</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Trusted by Thousands of Patients
            </h2>
            <p className="text-slate-400 text-xs">
              Read how WeCare Doctors and modern nursing teams helped our patients recover smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-slate-800/65 border border-slate-800 p-6 rounded-2xl space-y-4 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div>
                    <h5 className="font-semibold text-white">{t.name}</h5>
                    <p>{t.role}</p>
                  </div>
                  <span>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Health Tips Blog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Weekly Insights</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Clinical Health Tips & Advice
          </h2>
          <p className="text-slate-500 text-sm">
            Read health notes authored by our leading clinicians to improve physical wellbeing and support disease prevention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestTips.map((tip) => (
            <article 
              key={tip.id}
              className="bg-white rounded-2xl border border-gray-100 p-6.5 text-left flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono text-[10px]">
                    {tip.category}
                  </span>
                  <span className="text-slate-400 font-medium">{tip.readTime}</span>
                </div>
                
                <h3 className="font-sans font-extrabold text-base text-slate-900 leading-snug">
                  {tip.title}
                </h3>
                
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {tip.content}
                </p>
              </div>

              <div className="pt-5 border-t border-gray-50 flex items-center justify-between text-[11px] text-slate-400 mt-6">
                <span>Published: {tip.date}</span>
                <span className="text-teal-600 font-semibold">Clinician Approved</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Direct Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Background shapes */}
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-teal-400 rounded-full blur-2xl opacity-20" />
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500 rounded-full blur-2xl opacity-20" />

          <div className="relative z-10 max-w-xl space-y-3">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
              Ready to Consult with a Medical Specialist?
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Book a clinic consultation online in under 2 minutes. We will register your file, reserve your doctor, and send you detailed instructions.
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-50 font-bold px-7 py-3.5 rounded-xl text-sm transition-transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Schedule Online Now
            </button>
            <a
              href="tel:+15551012000"
              className="w-full sm:w-auto text-white hover:text-teal-100 font-semibold text-sm py-3 px-4 border border-white/20 hover:border-white/40 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              Call Clinic Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
