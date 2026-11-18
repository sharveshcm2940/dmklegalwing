'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Leader, 
  DistrictInfo, 
  EventItem, 
  LegalResource, 
  NewsItem, 
  AdvocateRegistration, 
  PublicEnquiry 
} from '../types';
import { 
  LEADERSHIP_PROFILES, 
  TAMIL_NADU_DISTRICTS, 
  LEGAL_RESOURCES, 
  EVENTS_DATA, 
  NEWS_ITEMS 
} from '../data/content';

interface DataContextType {
  leaders: Leader[];
  districts: DistrictInfo[];
  resources: LegalResource[];
  events: EventItem[];
  news: NewsItem[];
  registrations: AdvocateRegistration[];
  enquiries: PublicEnquiry[];
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  deleteNews: (id: string) => void;
  addEvent: (item: Omit<EventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
  addResource: (item: Omit<LegalResource, 'id'>) => void;
  deleteResource: (id: string) => void;
  addLeader: (item: Omit<Leader, 'id'>) => void;
  deleteLeader: (id: string) => void;
  registerAdvocate: (data: Omit<AdvocateRegistration, 'id' | 'submittedAt' | 'status'>) => void;
  submitEnquiry: (data: Omit<PublicEnquiry, 'id' | 'submittedAt' | 'status'>) => void;
  updateRegistrationStatus: (id: string, status: AdvocateRegistration['status']) => void;
  updateEnquiryStatus: (id: string, status: PublicEnquiry['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const SEED_REGISTRATIONS: AdvocateRegistration[] = [
  {
    id: 'reg-001',
    fullName: 'Adv. S. K. Rajasekar',
    barCouncilNumber: 'MS/1420/2018',
    yearOfEnrollment: '2018',
    district: 'Chennai',
    courtOfPractice: 'Madras High Court',
    mobileNumber: '+91 98401 23456',
    emailAddress: 'rajasekar.adv@gmail.com',
    address: 'No 45, Armenian Street, George Town, Chennai',
    areasOfSpecialization: ['Constitutional Law', 'Service Law'],
    submittedAt: '2026-11-12T10:30:00Z',
    status: 'verified'
  },
  {
    id: 'reg-002',
    fullName: 'Adv. K. Senthamizhselvi',
    barCouncilNumber: 'MS/2890/2021',
    yearOfEnrollment: '2021',
    district: 'Madurai',
    courtOfPractice: 'Madras High Court (Madurai Bench)',
    mobileNumber: '+91 94432 98765',
    emailAddress: 'senthamizh.law@gmail.com',
    address: '12, West Masi Street, Madurai',
    areasOfSpecialization: ['Criminal Law', 'Human Rights'],
    submittedAt: '2026-11-15T14:20:00Z',
    status: 'approved'
  },
  {
    id: 'reg-003',
    fullName: 'Adv. T. Vetrivel',
    barCouncilNumber: 'MS/3310/2023',
    yearOfEnrollment: '2023',
    district: 'Coimbatore',
    courtOfPractice: 'Combined Court Buildings, Coimbatore',
    mobileNumber: '+91 97890 55432',
    emailAddress: 'vetrivel.advocate@outlook.com',
    address: '89, Arts College Road, Coimbatore',
    areasOfSpecialization: ['Labour Law', 'Civil Litigation'],
    submittedAt: '2026-11-17T09:15:00Z',
    status: 'pending'
  }
];

const SEED_ENQUIRIES: PublicEnquiry[] = [
  {
    id: 'enq-001',
    name: 'K. Muthuvel',
    phone: '+91 98410 11223',
    email: 'muthuvel.farmer@gmail.com',
    district: 'Thanjavur',
    subject: 'Assistance for Agricultural Land Patta Transfer',
    message: 'Seeking legal guidance regarding family land division and patta correction delayed at taluk office.',
    category: 'Legal Aid',
    submittedAt: '2026-11-16T11:45:00Z',
    status: 'reviewed'
  },
  {
    id: 'enq-002',
    name: 'Dr. S. Kavitha',
    phone: '+91 99620 44332',
    email: 'kavitha.prof@univ.ac.in',
    district: 'Chennai',
    subject: 'Request for Guest Lecture on Constitutional Federalism',
    message: 'We would like to invite an office bearer from DMK Legal Wing for a university symposium.',
    category: 'General Query',
    submittedAt: '2026-11-17T16:00:00Z',
    status: 'new'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaders, setLeaders] = useState<Leader[]>(LEADERSHIP_PROFILES);
  const [districts] = useState<DistrictInfo[]>(TAMIL_NADU_DISTRICTS);
  const [resources, setResources] = useState<LegalResource[]>(LEGAL_RESOURCES);
  const [events, setEvents] = useState<EventItem[]>(EVENTS_DATA);
  const [news, setNews] = useState<NewsItem[]>(NEWS_ITEMS);
  const [registrations, setRegistrations] = useState<AdvocateRegistration[]>(SEED_REGISTRATIONS);
  const [enquiries, setEnquiries] = useState<PublicEnquiry[]>(SEED_ENQUIRIES);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const savedNews = localStorage.getItem('dmk_news');
      if (savedNews) setNews(JSON.parse(savedNews));

      const savedEvents = localStorage.getItem('dmk_events');
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedResources = localStorage.getItem('dmk_resources');
      if (savedResources) setResources(JSON.parse(savedResources));

      const savedLeaders = localStorage.getItem('dmk_leaders');
      if (savedLeaders) setLeaders(JSON.parse(savedLeaders));

      const savedRegs = localStorage.getItem('dmk_registrations');
      if (savedRegs) setRegistrations(JSON.parse(savedRegs));

      const savedEnqs = localStorage.getItem('dmk_enquiries');
      if (savedEnqs) setEnquiries(JSON.parse(savedEnqs));
    } catch {
      // ignore
    }
  }, []);

  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = { ...item, id: `news-${Date.now()}` };
    const updated = [newItem, ...news];
    setNews(updated);
    localStorage.setItem('dmk_news', JSON.stringify(updated));
  };

  const deleteNews = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    localStorage.setItem('dmk_news', JSON.stringify(updated));
  };

  const addEvent = (item: Omit<EventItem, 'id'>) => {
    const newItem: EventItem = { ...item, id: `event-${Date.now()}` };
    const updated = [newItem, ...events];
    setEvents(updated);
    localStorage.setItem('dmk_events', JSON.stringify(updated));
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem('dmk_events', JSON.stringify(updated));
  };

  const addResource = (item: Omit<LegalResource, 'id'>) => {
    const newItem: LegalResource = { ...item, id: `res-${Date.now()}` };
    const updated = [newItem, ...resources];
    setResources(updated);
    localStorage.setItem('dmk_resources', JSON.stringify(updated));
  };

  const deleteResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    localStorage.setItem('dmk_resources', JSON.stringify(updated));
  };

  const addLeader = (item: Omit<Leader, 'id'>) => {
    const newItem: Leader = { ...item, id: `leader-${Date.now()}` };
    const updated = [...leaders, newItem];
    setLeaders(updated);
    localStorage.setItem('dmk_leaders', JSON.stringify(updated));
  };

  const deleteLeader = (id: string) => {
    const updated = leaders.filter((l) => l.id !== id);
    setLeaders(updated);
    localStorage.setItem('dmk_leaders', JSON.stringify(updated));
  };

  const registerAdvocate = (data: Omit<AdvocateRegistration, 'id' | 'submittedAt' | 'status'>) => {
    const newReg: AdvocateRegistration = {
      ...data,
      id: `reg-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('dmk_registrations', JSON.stringify(updated));
  };

  const submitEnquiry = (data: Omit<PublicEnquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newEnq: PublicEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };
    const updated = [newEnq, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem('dmk_enquiries', JSON.stringify(updated));
  };

  const updateRegistrationStatus = (id: string, status: AdvocateRegistration['status']) => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, status } : r));
    setRegistrations(updated);
    localStorage.setItem('dmk_registrations', JSON.stringify(updated));
  };

  const updateEnquiryStatus = (id: string, status: PublicEnquiry['status']) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiries(updated);
    localStorage.setItem('dmk_enquiries', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider
      value={{
        leaders,
        districts,
        resources,
        events,
        news,
        registrations,
        enquiries,
        addNews,
        deleteNews,
        addEvent,
        deleteEvent,
        addResource,
        deleteResource,
        addLeader,
        deleteLeader,
        registerAdvocate,
        submitEnquiry,
        updateRegistrationStatus,
        updateEnquiryStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
