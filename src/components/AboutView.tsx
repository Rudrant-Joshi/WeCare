import React from 'react';
import { motion } from 'motion/react';
import { 
  HeartHandshake, Award, ShieldAlert, FlaskConical, 
  MapPin, Clock, History, Check, ShieldCheck 
} from 'lucide-react';

export default function AboutView() {
  const coreValues = [
    {
      icon: <HeartHandshake className="w-6 h-6 text-teal-600" />,
      title: "Compassionate Care",
      description: "We treat every patient like a beloved member of our own family. Empathy guides our bedside manner and medical companionship."
    },
    {
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      title: "Clinical Perfection",
      description: "We hold our clinical staff to the most rigorous standards of evidence-based therapeutics and ongoing surgical training."
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      title: "Patient-First Innovation",
      description: "We actively invest in robotic-assisted surgery platforms, smart health tracking, digital pathology, and clinical research."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      title: "Absolute Integrity",
      description: "We strictly protect medical confidentiality and maintain transparent billing, clear procedures, and patient advocacy."
    }
  ];

  const milestones = [
    {
      year: "1996",
      title: "Hospital Foundation",
      description: "WeCare was established as a 40-bed local outpatient clinic in NY with a small team of dedicated family physicians."
    },
    {
      year: "2005",
      title: "Specialized Cardiology Wing",
      description: "Inaugurated a dedicated state-of-the-art heart surgery board and expanded capacity to 120 in-patient beds."
    },
    {
      year: "2015",
      title: "Joint Commission Gold Seal",
      description: "Achieved prestigious Joint Commission accreditation, confirming compliance with highest national medical quality benchmarks."
    },
    {
      year: "2023",
      title: "Robotic Surgery & Smart Labs",
      description: "Integrated AI-driven robotic assistance for orthopedics/cardiology and launched our digital patient booking system."
    }
  ];

  const statistics = [
    { label: "Critical Care Beds", value: "80+" },
    { label: "Outpatient Departments", value: "18" },
    { label: "Major Surgeries Annually", value: "4,200+" },
    { label: "Ambulance Fleet", value: "12" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 text-left" id="about-view">
      
      {/* 1. Introductory Header */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Our Heritage</span>
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Caring for Your Health Since 1996
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            At WeCare Hospitals, we recognize that true healing is a careful blend of medical science, technological innovation, and sincere compassion. Over three decades, we have transformed from a localized community clinic into one of the region's most reputable healthcare centers.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            Every room in our campus is designed to promote patient comfort and tranquility, supported by modern HVAC cleanrooms, sterile surgical chambers, and a tireless support desk.
          </p>
          
          {/* Quick Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'Joint Commission Gold Seal Certified',
              '24/7 Trauma Emergency Unit',
              'Fully Electronic Health Record (EHR)',
              'Multi-disciplinary Research Boards'
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Check className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="bg-gradient-to-tr from-teal-500 to-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          
          <div className="space-y-3">
            <span className="text-teal-200 font-mono text-xs uppercase tracking-widest font-semibold">Our Philosophy</span>
            <blockquote className="text-xl font-medium leading-relaxed italic text-white">
              "We believe that healthcare shouldn't be transaction-based. Every consultation, every surgery, and every recovery check is an opportunity to honor patient trust with world-class skill."
            </blockquote>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h4 className="font-bold text-base">Dr. Julian Sterling</h4>
            <p className="text-xs text-teal-200">Medical Director & Co-Founder, WeCare Hospitals</p>
          </div>
        </div>
      </section>

      {/* 2. Core Values Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Our Pillars</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Core Clinical Values</h2>
          <p className="text-slate-500 text-sm">
            These fundamental principles guide every medical recommendation, patient interaction, and institutional expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start text-left"
            >
              <div className="p-3 bg-slate-50 rounded-xl mb-4">
                {value.icon}
              </div>
              <h3 className="text-slate-900 font-bold text-base mb-2">{value.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Timelines & Milestones */}
      <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-100 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Our Journey</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Timeline of Excellence</h2>
          <p className="text-slate-500 text-sm">
            Follow the key milestones that helped shape WeCare into a premier regional healthcare champion.
          </p>
        </div>

        <div className="relative border-l-2 border-teal-200 ml-4 md:ml-32 space-y-12 py-4">
          {milestones.map((mile, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16">
              {/* Timeline marker */}
              <div className="absolute -left-2 top-1 w-4.5 h-4.5 rounded-full bg-teal-500 border-4 border-white shadow-md" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2">
                  <span className="text-2xl font-extrabold text-teal-600 font-mono tracking-tight">{mile.year}</span>
                </div>
                <div className="md:col-span-10 space-y-1">
                  <h4 className="font-bold text-base text-slate-900">{mile.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{mile.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Campus Infrastructure & Statistics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white">
        <div className="space-y-6">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest font-mono">Our Facility</span>
          <h2 className="font-sans font-extrabold text-3xl text-slate-900 tracking-tight">
            Advanced Clinical Infrastructure
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our campus spans over 240,000 square feet, built to handle emergency triage, specialty consults, and inpatient recovery. Our operating chambers are fitted with advanced airflow laminar systems to reduce surgical infection risks to zero.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-4">
            {statistics.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-2xl font-extrabold text-slate-950 font-sans block">{stat.value}</span>
                <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Informative Grid Details */}
        <div className="space-y-4">
          <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 flex items-start gap-4">
            <div className="p-3 bg-teal-500 text-white rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Admissions Desk & Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Emergency room is active 24/7, with ambulance pick up. Clinical out-patient departments operate Sunday to Friday with pre-scheduled tokens.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex items-start gap-4">
            <div className="p-3 bg-indigo-500 text-white rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Central Location</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conveniently located in the center of the Medical District with ample safe parking, wheel-chair friendly corridors, and a direct city transit connection.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
