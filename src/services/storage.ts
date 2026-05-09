import { JournalEntry } from '../types';

export interface IStorageService {
  getEntries(): Promise<JournalEntry[]>;
  saveEntry(entry: JournalEntry): Promise<void>;
  deleteEntry(id: string): Promise<void>;
  getEntry(id: string): Promise<JournalEntry | null>;
}

class LocalStorageService implements IStorageService {
  private STORAGE_KEY = 'zenlog_entries';

  async getEntries(): Promise<JournalEntry[]> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    const entries = JSON.parse(data);
    return entries.map((e: any) => ({
      ...e,
      date: new Date(e.date),
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
      unlockDate: e.unlockDate ? new Date(e.unlockDate) : undefined
    }));
  }

  async saveEntry(entry: JournalEntry): Promise<void> {
    const entries = await this.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  async getEntry(id: string): Promise<JournalEntry | null> {
    const entries = await this.getEntries();
    return entries.find(e => e.id === id) || null;
  }
}

export const storage = new LocalStorageService();
