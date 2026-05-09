/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodValue = 'happy' | 'calm' | 'neutral' | 'sad' | 'tired' | 'energetic';

export interface MoodInfo {
  value: MoodValue;
  weather: string; // Ikon cuaca (AI result)
  color: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: Date;
  mood: MoodValue;
  weatherIcon?: string;
  photoUrl?: string;
  templateId?: string;
  isLocked?: boolean;
  unlockDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export interface UserSettings {
  name: string;
  theme: 'light' | 'dark';
  ambientSound?: string;
}
