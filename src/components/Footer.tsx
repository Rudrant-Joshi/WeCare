import React from 'react';
import { motion } from 'motion/react';
import { HeartPulse, Mail, Phone, MapPin, Clock } from 'lucide-react';
import ScrollAnimate, { StaggerContainer, StaggerItem } from './ScrollAnimate';

interface FooterProps {
  setTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export default function Footer({ setTab, onOpenBooking }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-12" staggerDelay={0.1}>
          {/* Brand Column */}
          <StaggerItem className="md:col-span-1">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-2.5 cursor-pointer" 
                onClick={() => setTab('home')}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-900/50 icon-hover-bounce">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-sans font-bold text-xl tracking-tight text-white">
                    WeCare
                  </span>
                  <span className="text-teal-400 font-bold text-xl">.</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium -mt-1">
                    Hospitals
                  </p>
                </div>
              </motion.div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Providing cutting-edge healthcare options with unmatched clinical perfection and empathetic bedside companion care since 1996.
              </p>
              <div className="flex items-center gap-2 bg-slate-800/80 p-3.5 rounded-xl border border-slate-800 w-full">
                <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Emergency Care</p>
                  <p className="text-sm font-semibold text-white">Available 24/7/365</p>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Quick Links */}
          <StaggerItem>
            <div>
              <h3 className="text-white font-semibold text-base mb-6 tracking-tight">Our Hospital</h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <button 
                    onClick={() => setTab('home')} 
                    className="hover:text-teal-400 transition-colors text-slate-400 cursor-pointer text-left footer-link"
                  >
                    Home Page
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTab('about')} 
                    className="hover:text-teal-400 transition-colors text-slate-400 cursor-pointer text-left footer-link"
                  >
                    About Us & Values
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTab('departments')} 
                    className="hover:text-teal-400 transition-colors text-slate-400 cursor-pointer text-left footer-link"
                  >
                    Medical Departments
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTab('doctors')} 
                    className="hover:text-teal-400 transition-colors text-slate-400 cursor-pointer text-left footer-link"
                  >
                    Specialist Doctors
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setTab('bookings')} 
                    className="hover:text-teal-400 transition-colors text-slate-400 cursor-pointer text-left footer-link"
                  >
                    My Booked Appointments
                  </button>
                </li>
              </ul>
            </div>
          </StaggerItem>

          {/* OPD Operating Hours */}
          <StaggerItem>
            <div>
              <h3 className="text-white font-semibold text-base mb-6 tracking-tight">OPD Consultations</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Monday - Friday</span>
                  <span className="text-white font-medium">8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Saturday</span>
                  <span className="text-white font-medium">9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Sunday</span>
                  <span className="text-white font-medium">10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Diagnostic Labs</span>
                  <span className="text-teal-400 font-medium">24 Hours</span>
                </li>
              </ul>
            </div>
          </StaggerItem>

          {/* Contact Details */}
          <StaggerItem>
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-base mb-6 tracking-tight">Get in Touch</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400 leading-relaxed">
                    100 Clinical Parkway, Medical District, Suite 500, New York, NY 10016
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                  <a href="tel:+15551012000" className="text-slate-300 hover:text-white font-medium transition-colors link-hover-underline">
                    +1 (555) 101-2000
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                  <a href="mailto:info@wecarehospitals.com" className="text-slate-300 hover:text-white transition-colors link-hover-underline">
                    contact@wecarehospitals.com
                  </a>
                </li>
              </ul>
              <div className="pt-4">
                <motion.button
                  onClick={onOpenBooking}
                  id="footer-cta-book"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer btn-shine"
                >
                  Schedule Consultation
                </motion.button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Bar */}
        <ScrollAnimate variant="fadeIn" delay={0.3}>
          <div className="mt-16 pt-8 border-t border-slate-800 text-center md:flex md:justify-between md:items-center text-xs text-slate-500">
            <p>© {currentYear} WeCare Hospitals. All Rights Reserved. Private & Confidential Medical Practice.</p>
            <div className="mt-4 md:mt-0 flex justify-center gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors link-hover-underline">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors link-hover-underline">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors link-hover-underline">Patient Bill of Rights</a>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </footer>
  );
}
