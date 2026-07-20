export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: 'admin' | 'patient';
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  degree: string;
  experienceYears: number;
  rating: number;
  avatarColor: string;
  schedule: string[];
  bio: string;
  education: string[];
  specialties: string[];
  email: string;
  imageUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
  services: string[];
  contactPhone: string;
  roomNumber: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  departmentId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
}

export interface HealthTip {
  id: string;
  title: string;
  category: string;
  content: string;
  readTime: string;
  date: string;
}
