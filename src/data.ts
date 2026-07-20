import { Department, Doctor, Testimonial, HealthTip } from './types';
import doc1Img from './assets/images/doctor_female_1_1784007229646.jpg';
import doc2Img from './assets/images/doctor_male_1_1784007242312.jpg';
import doc3Img from './assets/images/doctor_female_2_1784007255685.jpg';
import doc4Img from './assets/images/doctor_male_2_1784007266674.jpg';
import doc5Img from './assets/images/doc_img_5_1784007715377.jpg';
import doc6Img from './assets/images/doc_img_6_1784007727565.jpg';
import doc7Img from './assets/images/doc_img_7_1784007738996.jpg';
import doc8Img from './assets/images/doc_img_8_1784007751540.jpg';
import doc9Img from './assets/images/doc_img_9_1784007764970.jpg';
import doc10Img from './assets/images/doc_img_10_1784007777433.jpg';
import doc11Img from './assets/images/doc_img_11_1784007790301.jpg';
import doc12Img from './assets/images/doc_img_12_1784007805363.jpg';
import doc13Img from './assets/images/doc_img_13_1784007817411.jpg';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Comprehensive cardiovascular care providing advanced diagnostics, interventional procedures, and cardiac rehabilitation.',
    iconName: 'Heart',
    services: [
      'Electrocardiogram (ECG)',
      'Echocardiography',
      'Cardiac Catheterization',
      'Heart Failure Management',
      'Hypertension Clinic'
    ],
    contactPhone: '+1 (555) 101-2001',
    roomNumber: 'Wing A, 2nd Floor'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Dedicated pediatric care supporting children\'s health from newborn care through adolescence with a warm, friendly touch.',
    iconName: 'Baby',
    services: [
      'Newborn Screenings',
      'Immunizations & Vaccinations',
      'Growth & Development Monitoring',
      'Childhood Asthma Program',
      'Pediatric Emergency Care'
    ],
    contactPhone: '+1 (555) 101-2002',
    roomNumber: 'Wing B, Ground Floor'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Advanced diagnosis and specialized treatment for complex neurological conditions affecting the brain, spine, and nervous system.',
    iconName: 'Activity',
    services: [
      'EEG & Electromyography',
      'Stroke Rehabilitation',
      'Epilepsy Management Clinic',
      'Migraine & Headache Therapy',
      'Sleep Disorders Evaluation'
    ],
    contactPhone: '+1 (555) 101-2003',
    roomNumber: 'Wing C, 3rd Floor'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Expert care for bones, joints, ligaments, tendons, and muscles, covering advanced surgeries and physical rehabilitation.',
    iconName: 'Bone',
    services: [
      'Joint Replacement Surgery',
      'Sports Medicine & Trauma',
      'Spine & Back Pain Care',
      'Arthroscopic Surgery',
      'Physical Therapy Programs'
    ],
    contactPhone: '+1 (555) 101-2004',
    roomNumber: 'Wing A, 1st Floor'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    description: 'Compassionate, multi-disciplinary cancer treatment delivering advanced chemotherapy, immunotherapy, and genetic profiling.',
    iconName: 'Shield',
    services: [
      'Chemotherapy & Infusions',
      'Immunotherapy & Target Biologics',
      'Cancer Genetic Counseling',
      'Pain & Palliative Management',
      'Clinical Trial Screenings'
    ],
    contactPhone: '+1 (555) 101-2005',
    roomNumber: 'Wing D, 4th Floor'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Expert medical, surgical, and cosmetic dermatology services for beautiful, healthy skin, hair, and nails.',
    iconName: 'Sparkles',
    services: [
      'Skin Cancer Screening (Biopsies)',
      'Acne & Rosacea Specialized Clinic',
      'Psoriasis & Eczema Management',
      'Laser Skin Resurfacing',
      'Allergy Patch Testing'
    ],
    contactPhone: '+1 (555) 101-2006',
    roomNumber: 'Wing B, 1st Floor'
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology Doctors
  {
    id: 'doc-1',
    name: 'Dr. Sarah Sterling',
    role: 'Chief Cardiologist',
    departmentId: 'cardiology',
    degree: 'MD, FACC, PhD',
    experienceYears: 18,
    rating: 4.9,
    avatarColor: 'from-emerald-400 to-teal-500',
    schedule: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Dr. Sarah Sterling is a nationally recognized cardiologist specializing in interventional cardiology and preventative heart care. She is dedicated to combining medical excellence with active lifestyle coaching.',
    education: [
      'Medical School: Johns Hopkins School of Medicine',
      'Residency: Massachusetts General Hospital',
      'Fellowship: Harvard Cardiovascular Center'
    ],
    specialties: ['Interventional Cardiology', 'Preventative Medicine', 'Coronary Artery Disease'],
    email: 's.sterling@wecarehospitals.com',
    imageUrl: doc1Img
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    role: 'Senior Cardiac Surgeon',
    departmentId: 'cardiology',
    degree: 'MD, FACS',
    experienceYears: 15,
    rating: 4.8,
    avatarColor: 'from-blue-400 to-indigo-500',
    schedule: ['Tuesday', 'Thursday'],
    bio: 'Dr. Marcus Vance has performed over 2,500 successful cardiothoracic procedures. He is passionate about minimally invasive cardiac surgeries and artificial heart valve technology.',
    education: [
      'Medical School: Stanford University School of Medicine',
      'Residency: Cleveland Clinic Foundation',
      'Fellowship: Mayo Clinic Department of Surgery'
    ],
    specialties: ['Heart Valve Repair', 'Aortic Root Reconstruction', 'Minimally Invasive Surgery'],
    email: 'm.vance@wecarehospitals.com',
    imageUrl: doc2Img
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    role: 'Pediatric Cardiologist',
    departmentId: 'cardiology',
    degree: 'MD, PhD',
    experienceYears: 12,
    rating: 4.9,
    avatarColor: 'from-pink-400 to-rose-500',
    schedule: ['Monday', 'Tuesday', 'Thursday'],
    bio: 'Dr. Elena Rostova specializes in detecting and managing congenital heart defects in children and young infants. She is known for her reassuring bedside manner.',
    education: [
      'Medical School: Columbia College of Physicians and Surgeons',
      'Residency: Boston Children\'s Hospital',
      'Fellowship: Children\'s Hospital of Philadelphia'
    ],
    specialties: ['Congenital Heart Defects', 'Fetal Echocardiography', 'Pediatric Arrhythmias'],
    email: 'e.rostova@wecarehospitals.com',
    imageUrl: doc3Img
  },

  // Pediatrics Doctors
  {
    id: 'doc-4',
    name: 'Dr. Aris Patel',
    role: 'Head of Pediatrics',
    departmentId: 'pediatrics',
    degree: 'MD, FAAP',
    experienceYears: 16,
    rating: 4.9,
    avatarColor: 'from-amber-400 to-orange-500',
    schedule: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    bio: 'Dr. Aris Patel believes in comprehensive pediatric care that integrates physical growth, cognitive development, and behavioral health. He treats every child like his own.',
    education: [
      'Medical School: University of Michigan Medical School',
      'Residency: UCSF Benioff Children\'s Hospital',
      'Fellowship: Stanford Pediatric Fellow Program'
    ],
    specialties: ['Early Childhood Development', 'Immunology & Allergy', 'Adolescent Medicine'],
    email: 'a.patel@wecarehospitals.com',
    imageUrl: doc4Img
  },
  {
    id: 'doc-5',
    name: 'Dr. Clara Thorne',
    role: 'Pediatric Pulmonologist',
    departmentId: 'pediatrics',
    degree: 'MD',
    experienceYears: 10,
    rating: 4.7,
    avatarColor: 'from-purple-400 to-indigo-500',
    schedule: ['Wednesday', 'Thursday', 'Friday'],
    bio: 'Dr. Clara Thorne specializes in complex respiratory disorders, including pediatric asthma and allergies. She actively publishes in international respiratory journals.',
    education: [
      'Medical School: Duke University School of Medicine',
      'Residency: Northwestern University Children\'s Hospital',
      'Fellowship: University of Washington Pediatric Pulmonology'
    ],
    specialties: ['Childhood Asthma', 'Cystic Fibrosis', 'Chronic Cough & Allergy'],
    email: 'c.thorne@wecarehospitals.com',
    imageUrl: doc5Img
  },

  // Neurology Doctors
  {
    id: 'doc-6',
    name: 'Dr. Julian Sterling',
    role: 'Chief Neurologist',
    departmentId: 'neurology',
    degree: 'MD, PhD',
    experienceYears: 22,
    rating: 5.0,
    avatarColor: 'from-violet-500 to-fuchsia-600',
    schedule: ['Monday', 'Thursday'],
    bio: 'Dr. Julian Sterling is an authority on Parkinson\'s and alzheimer\'s disease. He leads clinical research trials and coordinates our multi-disciplinary neurology department.',
    education: [
      'Medical School: Yale School of Medicine',
      'Residency: Columbia University Medical Center',
      'Fellowship: NIH Neurodegenerative Disease Program'
    ],
    specialties: ['Parkinson\'s Disease', 'Cognitive Neurological Disorders', 'Dementia Research'],
    email: 'j.sterling@wecarehospitals.com',
    imageUrl: doc6Img
  },
  {
    id: 'doc-7',
    name: 'Dr. Maya Lin',
    role: 'Consultant Neurologist',
    departmentId: 'neurology',
    degree: 'MD',
    experienceYears: 11,
    rating: 4.8,
    avatarColor: 'from-cyan-400 to-blue-600',
    schedule: ['Tuesday', 'Wednesday', 'Friday'],
    bio: 'Dr. Maya Lin focuses on the diagnosis and treatment of headache syndromes, sleep disorders, and complex epilepsy cases using high-resolution neuroimaging.',
    education: [
      'Medical School: NYU Grossman School of Medicine',
      'Residency: UCLA Medical Center',
      'Fellowship: UCSF Epilepsy & Sleep Center'
    ],
    specialties: ['Epilepsy & Seizure Disorders', 'Migraine Management', 'Electroencephalography (EEG)'],
    email: 'm.lin@wecarehospitals.com',
    imageUrl: doc7Img
  },

  // Orthopedics Doctors
  {
    id: 'doc-8',
    name: 'Dr. Robert Lawson',
    role: 'Orthopedic Joint Surgeon',
    departmentId: 'orthopedics',
    degree: 'MD, FAAOS',
    experienceYears: 20,
    rating: 4.9,
    avatarColor: 'from-sky-400 to-blue-600',
    schedule: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Dr. Robert Lawson is highly regarded for hip and knee replacement procedures. He uses state-of-the-art robotic-assisted surgical platforms for outstanding outcomes.',
    education: [
      'Medical School: University of Pennsylvania School of Medicine',
      'Residency: Hospital for Special Surgery, NY',
      'Fellowship: Rush University Orthopedic Department'
    ],
    specialties: ['Hip Arthroplasty', 'Robotic-Assisted Joint Surgery', 'Trauma Reconstruction'],
    email: 'r.lawson@wecarehospitals.com',
    imageUrl: doc8Img
  },
  {
    id: 'doc-9',
    name: 'Dr. Fiona Gallagher',
    role: 'Sports Medicine Specialist',
    departmentId: 'orthopedics',
    degree: 'MD, PhD',
    experienceYears: 13,
    rating: 4.8,
    avatarColor: 'from-emerald-400 to-green-600',
    schedule: ['Tuesday', 'Thursday'],
    bio: 'Dr. Fiona Gallagher treats professional and elite college athletes. She specializes in minimally invasive arthroscopic repair of ligaments, tendons, and cartilage.',
    education: [
      'Medical School: Washington University School of Medicine',
      'Residency: University of Pittsburgh Medical Center',
      'Fellowship: Steadman Hawkins Sports Clinic'
    ],
    specialties: ['ACL & Meniscus Reconstruction', 'Rotator Cuff Surgery', 'Cartilage Restoration'],
    email: 'f.gallagher@wecarehospitals.com',
    imageUrl: doc9Img
  },

  // Oncology Doctors
  {
    id: 'doc-10',
    name: 'Dr. Samuel Kross',
    role: 'Director of Oncology',
    departmentId: 'oncology',
    degree: 'MD, PhD',
    experienceYears: 19,
    rating: 4.9,
    avatarColor: 'from-teal-400 to-blue-500',
    schedule: ['Monday', 'Tuesday', 'Thursday'],
    bio: 'Dr. Samuel Kross is committed to cutting-edge cancer immunotherapy and customized clinical protocols. He serves on the editorial board of major oncology journals.',
    education: [
      'Medical School: Harvard Medical School',
      'Residency: Brigham and Women\'s Hospital',
      'Fellowship: Dana-Farber Cancer Institute'
    ],
    specialties: ['Immunotherapy', 'Targeted Molecular Therapies', 'Solid Tumor Treatment'],
    email: 's.kross@wecarehospitals.com',
    imageUrl: doc10Img
  },
  {
    id: 'doc-11',
    name: 'Dr. Naomi Vance',
    role: 'Breast Cancer Specialist',
    departmentId: 'oncology',
    degree: 'MD',
    experienceYears: 12,
    rating: 4.9,
    avatarColor: 'from-rose-400 to-pink-500',
    schedule: ['Wednesday', 'Thursday', 'Friday'],
    bio: 'Dr. Naomi Vance offers comprehensive, compassionate breast health consultations. She works alongside surgeons and radiologists to provide supportive, multi-tiered therapies.',
    education: [
      'Medical School: Cornell University Medical College',
      'Residency: New York-Presbyterian Hospital',
      'Fellowship: Memorial Sloan Kettering Cancer Center'
    ],
    specialties: ['Hormonal Oncotherapy', 'Breast Health Management', 'Survivorship Planning'],
    email: 'n.vance@wecarehospitals.com',
    imageUrl: doc11Img
  },

  // Dermatology Doctors
  {
    id: 'doc-12',
    name: 'Dr. Evelyn Mercer',
    role: 'Senior Dermatologist',
    departmentId: 'dermatology',
    degree: 'MD, FAAD',
    experienceYears: 14,
    rating: 4.8,
    avatarColor: 'from-amber-300 to-rose-400',
    schedule: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Dr. Evelyn Mercer is an expert in dermatological oncology, auto-immune skin conditions, and aesthetic laser therapy. She balances medical necessity with cosmetic perfection.',
    education: [
      'Medical School: Vanderbilt University School of Medicine',
      'Residency: Mayo School of Graduate Medical Education',
      'Fellowship: University of Texas Dermatology Group'
    ],
    specialties: ['Melanoma Screenings', 'Psoriasis Biologics', 'Aesthetic Dermatology'],
    email: 'e.mercer@wecarehospitals.com',
    imageUrl: doc12Img
  },
  {
    id: 'doc-13',
    name: 'Dr. Kenji Sato',
    role: 'Clinical Dermatologist',
    departmentId: 'dermatology',
    degree: 'MD',
    experienceYears: 9,
    rating: 4.7,
    avatarColor: 'from-green-400 to-sky-500',
    schedule: ['Tuesday', 'Thursday'],
    bio: 'Dr. Kenji Sato treats common and rare pediatric skin disorders, drug rashes, and acne. He is dedicated to accessible skin health advice and routine mole tracking.',
    education: [
      'Medical School: Boston University School of Medicine',
      'Residency: Tufts Medical Center',
      'Fellowship: Boston Dermatology Joint Fellow'
    ],
    specialties: ['Acne Vulgaris', 'Atopic Dermatitis', 'Contact Allergy Testing'],
    email: 'k.sato@wecarehospitals.com',
    imageUrl: doc13Img
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'James Reynolds',
    role: 'Cardiology Patient',
    comment: 'The level of care I received from Dr. Sterling and the cardiovascular team was outstanding. The modern facilities and clear instructions made my recovery stress-free.',
    rating: 5,
    date: 'June 14, 2026'
  },
  {
    id: 't-2',
    name: 'Sophia Patel',
    role: 'Mother of Pediatric Patient',
    comment: 'Dr. Aris Patel is wonderful with kids! He explained things carefully, was incredibly warm, and answered all our questions. Highly recommend WeCare Pediatrics!',
    rating: 5,
    date: 'July 2, 2026'
  },
  {
    id: 't-3',
    name: 'Robert Jenkins',
    role: 'Orthopedics Patient',
    comment: 'Thanks to Dr. Lawson\'s knee replacement surgery and physical therapy, I am back to playing golf pain-free. A life-changing experience!',
    rating: 5,
    date: 'May 18, 2026'
  },
  {
    id: 't-4',
    name: 'Amina Al-Masri',
    role: 'Neurology Patient',
    comment: 'Dr. Lin helped diagnose and manage my chronic migraines which had troubled me for years. Her professional, state-of-the-art diagnostic approach was amazing.',
    rating: 4,
    date: 'April 29, 2026'
  }
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    title: 'Understanding Heart Rate Variability (HRV)',
    category: 'Cardiology',
    content: 'Heart Rate Variability is a key marker of autonomic nervous system health. Regular exercise, 7-8 hours of sound sleep, and stress reduction through daily mindfulness have been clinically shown to boost HRV and support cardiac resilience.',
    readTime: '3 min read',
    date: 'July 10, 2026'
  },
  {
    id: 'tip-2',
    title: 'Essential Vaccinations for Young Children',
    category: 'Pediatrics',
    content: 'Keeping children on schedule for core vaccinations (MMR, DTaP, Polio) creates critical communal immunity. Always consult with your pediatrician during scheduled milestone visits to ensure vaccine coverage and physical wellbeing.',
    readTime: '4 min read',
    date: 'July 5, 2026'
  },
  {
    id: 'tip-3',
    title: 'Post-Surgery Bone Health & Nutrition',
    category: 'Orthopedics',
    content: 'Proper joint recovery begins with targeted nutrition. Consuming adequate Calcium, Vitamin D3, and lean protein supports muscular repair and structural skeletal fusion. Follow physical therapy regimens with consistent hydration.',
    readTime: '3 min read',
    date: 'June 28, 2026'
  },
  {
    id: 'tip-4',
    title: 'Daily Habits for Stroke Prevention',
    category: 'Neurology',
    content: 'Up to 80% of premature strokes can be prevented by maintaining normal blood pressure, avoiding smoking, monitoring cholesterol levels, and staying physically active for at least 30 minutes a day.',
    readTime: '5 min read',
    date: 'June 15, 2026'
  }
];
