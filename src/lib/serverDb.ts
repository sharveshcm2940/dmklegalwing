import fs from 'fs/promises';
import path from 'path';
import { 
  AdvocateRegistration, 
  PublicEnquiry, 
  NewsItem, 
  EventItem, 
  LegalResource, 
  PressGalleryItem,
  DistrictInfo,
  AuditLogItem
} from '@/types';
import { 
  NEWS_ITEMS, 
  EVENTS_DATA, 
  LEGAL_RESOURCES, 
  PRESS_GALLERY_DATA 
} from '@/data/content';
import { TAMIL_NADU_DISTRICTS } from '@/data/districts74';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

async function ensureDbDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create DB directory', error);
  }
}

async function readTable<T>(filename: string, defaultFactory: () => T): Promise<T> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const initial = defaultFactory();
      await writeTable(filename, initial);
      return initial;
    }
    console.error(`Error reading ${filename}:`, error);
    return defaultFactory();
  }
}

async function writeTable<T>(filename: string, data: T): Promise<void> {
  await ensureDbDir();
  const filePath = path.join(DB_DIR, filename);
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, filePath);
  } catch (error) {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (writeErr) {
      console.error(`Error writing ${filename}:`, writeErr);
      throw writeErr;
    }
  }
}

// ==========================================
// 1. ADVOCATE REGISTRATIONS (Zero Seed Data)
// ==========================================
export async function getRegistrations(): Promise<AdvocateRegistration[]> {
  return readTable<AdvocateRegistration[]>('registrations.json', () => []);
}

export async function createRegistration(
  payload: Omit<AdvocateRegistration, 'id' | 'submittedAt' | 'status'>
): Promise<AdvocateRegistration> {
  const list = await getRegistrations();
  const newRecord: AdvocateRegistration = {
    ...payload,
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  const updated = [newRecord, ...list];
  await writeTable('registrations.json', updated);
  return newRecord;
}

export async function updateRegistrationStatus(
  id: string,
  status: AdvocateRegistration['status'],
  notes?: string
): Promise<AdvocateRegistration | null> {
  const list = await getRegistrations();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;
  list[index].status = status;
  if (notes !== undefined) (list[index] as any).notes = notes;
  await writeTable('registrations.json', list);
  return list[index];
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const list = await getRegistrations();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('registrations.json', filtered);
  return true;
}

// ==========================================
// 2. PUBLIC ENQUIRIES (Zero Seed Data)
// ==========================================
export async function getEnquiries(): Promise<PublicEnquiry[]> {
  return readTable<PublicEnquiry[]>('enquiries.json', () => []);
}

export async function createEnquiry(
  payload: Omit<PublicEnquiry, 'id' | 'submittedAt' | 'status'>
): Promise<PublicEnquiry> {
  const list = await getEnquiries();
  const newRecord: PublicEnquiry = {
    ...payload,
    id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    status: 'new'
  };
  const updated = [newRecord, ...list];
  await writeTable('enquiries.json', updated);
  return newRecord;
}

export async function updateEnquiryStatus(
  id: string,
  status: PublicEnquiry['status'],
  notes?: string
): Promise<PublicEnquiry | null> {
  const list = await getEnquiries();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;
  list[index].status = status;
  if (notes !== undefined) (list[index] as any).notes = notes;
  await writeTable('enquiries.json', list);
  return list[index];
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const list = await getEnquiries();
  const filtered = list.filter((e) => e.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('enquiries.json', filtered);
  return true;
}

// ==========================================
// 3. EDITORIAL NEWSROOM ITEMS
// ==========================================
export async function getNews(): Promise<NewsItem[]> {
  return readTable<NewsItem[]>('news.json', () => NEWS_ITEMS);
}

export async function createNews(payload: Omit<NewsItem, 'id'>): Promise<NewsItem> {
  const list = await getNews();
  const newRecord: NewsItem = {
    ...payload,
    id: `news-${Date.now()}`
  };
  // If marked as lead story, unset previous leads
  let updatedList = list;
  if (newRecord.isLeadStory) {
    updatedList = list.map((item) => ({ ...item, isLeadStory: false }));
  }
  const updated = [newRecord, ...updatedList];
  await writeTable('news.json', updated);
  return newRecord;
}

export async function setLeadStory(id: string): Promise<boolean> {
  const list = await getNews();
  const exists = list.some((n) => n.id === id);
  if (!exists) return false;
  const updated = list.map((item) => ({
    ...item,
    isLeadStory: item.id === id
  }));
  await writeTable('news.json', updated);
  return true;
}

export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
  const list = await getNews();
  const index = list.findIndex((n) => n.id === id);
  if (index === -1) return null;

  let updatedList = list;
  if (updates.isLeadStory) {
    updatedList = list.map((item) => ({ ...item, isLeadStory: false }));
  }

  const updatedRecord = { ...updatedList[index], ...updates };
  updatedList[index] = updatedRecord;
  await writeTable('news.json', updatedList);
  return updatedRecord;
}

export async function deleteNews(id: string): Promise<boolean> {
  const list = await getNews();
  const filtered = list.filter((n) => n.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('news.json', filtered);
  return true;
}

// ==========================================
// 4. PRESS GALLERY
// ==========================================
export async function getGallery(): Promise<PressGalleryItem[]> {
  return readTable<PressGalleryItem[]>('gallery.json', () => PRESS_GALLERY_DATA);
}

export async function createGalleryItem(payload: Omit<PressGalleryItem, 'id'>): Promise<PressGalleryItem> {
  const list = await getGallery();
  const newRecord: PressGalleryItem = {
    ...payload,
    id: `gal-${Date.now()}`
  };
  const updated = [newRecord, ...list];
  await writeTable('gallery.json', updated);
  return newRecord;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const list = await getGallery();
  const filtered = list.filter((g) => g.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('gallery.json', filtered);
  return true;
}

// ==========================================
// 5. EVENTS DATA
// ==========================================
export async function getEvents(): Promise<EventItem[]> {
  return readTable<EventItem[]>('events.json', () => EVENTS_DATA);
}

export async function createEvent(payload: Omit<EventItem, 'id'>): Promise<EventItem> {
  const list = await getEvents();
  const newRecord: EventItem = {
    ...payload,
    id: `evt-${Date.now()}`
  };
  const updated = [newRecord, ...list];
  await writeTable('events.json', updated);
  return newRecord;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
  const list = await getEvents();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  await writeTable('events.json', list);
  return list[index];
}

export async function deleteEvent(id: string): Promise<boolean> {
  const list = await getEvents();
  const filtered = list.filter((e) => e.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('events.json', filtered);
  return true;
}

// ==========================================
// 6. LEGAL RESOURCES
// ==========================================
export async function getResources(): Promise<LegalResource[]> {
  return readTable<LegalResource[]>('resources.json', () => LEGAL_RESOURCES);
}

export async function createResource(payload: Omit<LegalResource, 'id'>): Promise<LegalResource> {
  const list = await getResources();
  const newRecord: LegalResource = {
    ...payload,
    id: `res-${Date.now()}`
  };
  const updated = [newRecord, ...list];
  await writeTable('resources.json', updated);
  return newRecord;
}

export async function updateResource(id: string, updates: Partial<LegalResource>): Promise<LegalResource | null> {
  const list = await getResources();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  await writeTable('resources.json', list);
  return list[index];
}

export async function deleteResource(id: string): Promise<boolean> {
  const list = await getResources();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  await writeTable('resources.json', filtered);
  return true;
}

// ==========================================
// 7. 74 OFFICIAL DISTRICTS
// ==========================================
export async function getDistricts(): Promise<DistrictInfo[]> {
  return readTable<DistrictInfo[]>('districts.json', () => TAMIL_NADU_DISTRICTS);
}

export async function updateDistrict(id: string, updates: Partial<DistrictInfo>): Promise<DistrictInfo | null> {
  const list = await getDistricts();
  const index = list.findIndex((d) => d.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  await writeTable('districts.json', list);
  return list[index];
}

// ==========================================
// 8. AUDIT LOG (Activity Logging)
// ==========================================
export async function getAuditLogs(): Promise<AuditLogItem[]> {
  return readTable<AuditLogItem[]>('audit.json', () => []);
}

export async function addAuditLog(entry: Omit<AuditLogItem, 'id'>): Promise<AuditLogItem> {
  const list = await getAuditLogs();
  const newLog: AuditLogItem = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  };
  const updated = [newLog, ...list];
  await writeTable('audit.json', updated);
  return newLog;
}
