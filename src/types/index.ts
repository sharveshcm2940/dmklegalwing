export type Language = 'en' | 'ta';

export interface Leader {
  id: string;
  name: { en: string; ta: string };
  role: { en: string; ta: string };
  designation: { en: string; ta: string };
  level: 'state' | 'high_court' | 'district' | 'advisory';
  district?: string;
  zone?: 'North' | 'South' | 'West' | 'Central' | 'Chennai';
  barCouncilNo?: string;
  practiceArea?: { en: string; ta: string };
  bio: { en: string; ta: string };
  image: string;
  email?: string;
  phone?: string;
  court?: string;
  featured?: boolean;
}

export interface DistrictInfo {
  id: string;
  name: { en: string; ta: string };
  headquarters: { en: string; ta: string };
  zone: 'North' | 'South' | 'West' | 'Central' | 'Chennai';
  organizer: { en: string; ta: string };
  jointOrganizers: { en: string; ta: string }[];
  contactPhone: string;
  contactEmail: string;
  courtComplex: { en: string; ta: string };
  memberCount: number;
  activeCasesAssisted: number;
}

export interface HistoricalMilestone {
  year: string;
  title: { en: string; ta: string };
  description: { en: string; ta: string };
  category: 'Constitutional' | 'Reservation' | 'Legislation' | 'Movement';
  image?: string;
  significance: { en: string; ta: string };
}

export interface IdeologyPillar {
  id: string;
  number: string;
  title: { en: string; ta: string };
  subtitle: { en: string; ta: string };
  description: { en: string; ta: string };
  quote: {
    text: { en: string; ta: string };
    author: { en: string; ta: string };
    context: { en: string; ta: string };
  };
  keyPrinciples: { en: string; ta: string }[];
  legalRelevance: { en: string; ta: string };
  color: string;
}

export interface EventItem {
  id: string;
  title: { en: string; ta: string };
  category: 'Conference' | 'Legal Awareness' | 'Seminar' | 'Organisational' | 'Constitutional';
  date: string;
  time: string;
  venue: { en: string; ta: string };
  status: 'upcoming' | 'completed';
  description: { en: string; ta: string };
  chiefGuest?: { en: string; ta: string };
  attendeesCount?: number;
  image: string;
  gallery?: string[];
  reportPdfUrl?: string;
}

export interface LegalResource {
  id: string;
  title: { en: string; ta: string };
  category: 'Constitution' | 'Supreme Court' | 'High Court' | 'Handbook' | 'Statute' | 'Legal Aid';
  court?: 'Supreme Court of India' | 'Madras High Court' | 'Constitutional Bench';
  citation?: string;
  summary: { en: string; ta: string };
  keyHighlights: { en: string[]; ta: string[] };
  fileSize: string;
  downloadUrl: string;
  date: string;
  isOfficial: boolean;
}

export interface NewsItem {
  id: string;
  title: { en: string; ta: string };
  category: 'Press Release' | 'Statement' | 'Resolution' | 'Media' | 'Gazette';
  date: string;
  author: { en: string; ta: string };
  summary: { en: string; ta: string };
  content: { en: string; ta: string };
  image: string;
  featured?: boolean;
}

export interface AdvocateRegistration {
  id: string;
  fullName: string;
  barCouncilNumber: string;
  yearOfEnrollment: string;
  district: string;
  courtOfPractice: string;
  mobileNumber: string;
  emailAddress: string;
  address: string;
  areasOfSpecialization: string[];
  submittedAt: string;
  status: 'pending' | 'verified' | 'approved' | 'rejected';
}

export interface PublicEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  subject: string;
  message: string;
  category: 'Legal Aid' | 'General Query' | 'High Court Wing' | 'Press / Media';
  submittedAt: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface FlowchartOfficer {
  id: string;
  name: { en: string; ta: string };
  role: { en: string; ta: string };
  designation: { en: string; ta: string };
  district: { en: string; ta: string };
  branch: 'president' | 'secretary' | 'joint_secretaries' | 'deputy_secretaries' | 'headoffice_advocates';
  honorific?: { en: string; ta: string };
  bio?: { en: string; ta: string };
  court?: string;
  barCouncilNo?: string;
  isSenior?: boolean;
}
