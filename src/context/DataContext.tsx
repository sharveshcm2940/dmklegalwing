'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Leader, 
  DistrictInfo, 
  EventItem, 
  LegalResource, 
  NewsItem, 
  AdvocateRegistration, 
  PublicEnquiry,
  LegalDevelopmentItem,
  PressGalleryItem
} from '../types';
import { 
  LEADERSHIP_PROFILES, 
  TAMIL_NADU_DISTRICTS, 
  LEGAL_RESOURCES, 
  EVENTS_DATA, 
  NEWS_ITEMS,
  LEGAL_DEVELOPMENTS_DATA,
  PRESS_GALLERY_DATA
} from '../data/content';

interface DataContextType {
  leaders: Leader[];
  districts: DistrictInfo[];
  resources: LegalResource[];
  events: EventItem[];
  news: NewsItem[];
  legalDevelopments: LegalDevelopmentItem[];
  gallery: PressGalleryItem[];
  registrations: AdvocateRegistration[];
  enquiries: PublicEnquiry[];
  isLoadingData: boolean;
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  setLeadStory: (id: string) => Promise<void>;
  addGalleryItem: (item: Omit<PressGalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  addEvent: (item: Omit<EventItem, 'id'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addResource: (item: Omit<LegalResource, 'id'>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addLeader: (item: Omit<Leader, 'id'>) => void;
  deleteLeader: (id: string) => void;
  registerAdvocate: (data: Omit<AdvocateRegistration, 'id' | 'submittedAt' | 'status'>) => Promise<boolean>;
  submitEnquiry: (data: Omit<PublicEnquiry, 'id' | 'submittedAt' | 'status'>) => Promise<boolean>;
  updateRegistrationStatus: (id: string, status: AdvocateRegistration['status']) => Promise<void>;
  updateEnquiryStatus: (id: string, status: PublicEnquiry['status']) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaders, setLeaders] = useState<Leader[]>(LEADERSHIP_PROFILES);
  const [districts] = useState<DistrictInfo[]>(TAMIL_NADU_DISTRICTS);
  const [resources, setResources] = useState<LegalResource[]>(LEGAL_RESOURCES);
  const [events, setEvents] = useState<EventItem[]>(EVENTS_DATA);
  const [news, setNews] = useState<NewsItem[]>(NEWS_ITEMS);
  const [legalDevelopments] = useState<LegalDevelopmentItem[]>(LEGAL_DEVELOPMENTS_DATA);
  const [gallery, setGallery] = useState<PressGalleryItem[]>(PRESS_GALLERY_DATA);
  
  // Real live registrations & enquiries (Strictly ZERO seed data)
  const [registrations, setRegistrations] = useState<AdvocateRegistration[]>([]);
  const [enquiries, setEnquiries] = useState<PublicEnquiry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Sync from backend server API
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Fetch Registrations
      const regRes = await fetch('/api/registrations');
      if (regRes.ok) {
        const regData = await regRes.json();
        if (regData.success && Array.isArray(regData.registrations)) {
          setRegistrations(regData.registrations);
        }
      }

      // 2. Fetch Enquiries
      const enqRes = await fetch('/api/enquiries');
      if (enqRes.ok) {
        const enqData = await enqRes.json();
        if (enqData.success && Array.isArray(enqData.enquiries)) {
          setEnquiries(enqData.enquiries);
        }
      }

      // 3. Fetch News
      const newsRes = await fetch('/api/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.success && Array.isArray(newsData.news) && newsData.news.length > 0) {
          setNews(newsData.news);
        }
      }

      // 4. Fetch Events
      const evtRes = await fetch('/api/events');
      if (evtRes.ok) {
        const evtData = await evtRes.json();
        if (evtData.success && Array.isArray(evtData.events) && evtData.events.length > 0) {
          setEvents(evtData.events);
        }
      }

      // 5. Fetch Resources
      const resRes = await fetch('/api/resources');
      if (resRes.ok) {
        const resData = await resRes.json();
        if (resData.success && Array.isArray(resData.resources) && resData.resources.length > 0) {
          setResources(resData.resources);
        }
      }

      // 6. Fetch Gallery
      const galRes = await fetch('/api/gallery');
      if (galRes.ok) {
        const galData = await galRes.json();
        if (galData.success && Array.isArray(galData.gallery) && galData.gallery.length > 0) {
          setGallery(galData.gallery);
        }
      }
    } catch (error) {
      console.warn('Backend API synchronization notice (falling back to memory):', error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Advocate Registration API Handler
  const registerAdvocate = async (data: Omit<AdvocateRegistration, 'id' | 'submittedAt' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.registration) {
        setRegistrations((prev) => [json.registration, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration API error:', error);
      // Fallback optimistic local record
      const fallback: AdvocateRegistration = {
        ...data,
        id: `reg-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      setRegistrations((prev) => [fallback, ...prev]);
      return true;
    }
  };

  // Public Legal Aid Enquiry API Handler
  const submitEnquiry = async (data: Omit<PublicEnquiry, 'id' | 'submittedAt' | 'status'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.enquiry) {
        setEnquiries((prev) => [json.enquiry, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Enquiry API error:', error);
      // Fallback optimistic local record
      const fallback: PublicEnquiry = {
        ...data,
        id: `enq-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };
      setEnquiries((prev) => [fallback, ...prev]);
      return true;
    }
  };

  // Update Advocate Status (Pending -> Verified -> Approved -> Rejected)
  const updateRegistrationStatus = async (id: string, status: AdvocateRegistration['status']) => {
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Update registration status error:', error);
    }
  };

  // Update Citizen Enquiry Status (New -> Reviewed -> Resolved)
  const updateEnquiryStatus = async (id: string, status: PublicEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Update enquiry status error:', error);
    }
  };

  // Newsroom Management
  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (json.success && json.news) {
        setNews((prev) => [json.news, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Add news error:', error);
    }
    const fallback: NewsItem = { ...item, id: `news-${Date.now()}` };
    setNews((prev) => [fallback, ...prev]);
  };

  const deleteNews = async (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Delete news error:', error);
    }
  };

  const setLeadStory = async (id: string) => {
    setNews((prev) => prev.map((n) => ({ ...n, isLeadStory: n.id === id, featured: n.id === id })));
    try {
      await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setLeadStory' })
      });
    } catch (error) {
      console.error('Set lead story error:', error);
    }
  };

  // Gallery Management
  const addGalleryItem = async (item: Omit<PressGalleryItem, 'id'>) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (json.success && json.galleryItem) {
        setGallery((prev) => [json.galleryItem, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Add gallery error:', error);
    }
    const fallback: PressGalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGallery((prev) => [fallback, ...prev]);
  };

  const deleteGalleryItem = async (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Delete gallery error:', error);
    }
  };

  // Events Management
  const addEvent = async (item: Omit<EventItem, 'id'>) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (json.success && json.event) {
        setEvents((prev) => [json.event, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Add event error:', error);
    }
    const fallback: EventItem = { ...item, id: `event-${Date.now()}` };
    setEvents((prev) => [fallback, ...prev]);
  };

  const deleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Delete event error:', error);
    }
  };

  // Resources Management
  const addResource = async (item: Omit<LegalResource, 'id'>) => {
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (json.success && json.resource) {
        setResources((prev) => [json.resource, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Add resource error:', error);
    }
    const fallback: LegalResource = { ...item, id: `res-${Date.now()}` };
    setResources((prev) => [fallback, ...prev]);
  };

  const deleteResource = async (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Delete resource error:', error);
    }
  };

  const addLeader = (item: Omit<Leader, 'id'>) => {
    const newItem: Leader = { ...item, id: `leader-${Date.now()}` };
    setLeaders((prev) => [...prev, newItem]);
  };

  const deleteLeader = (id: string) => {
    setLeaders((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        leaders,
        districts,
        resources,
        events,
        news,
        legalDevelopments,
        gallery,
        registrations,
        enquiries,
        isLoadingData,
        addNews,
        deleteNews,
        setLeadStory,
        addGalleryItem,
        deleteGalleryItem,
        addEvent,
        deleteEvent,
        addResource,
        deleteResource,
        addLeader,
        deleteLeader,
        registerAdvocate,
        submitEnquiry,
        updateRegistrationStatus,
        updateEnquiryStatus,
        refreshAllData
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
