import { JournalTemplate } from './types';

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'gratitude',
    name: 'Vibe Check: Gratitude',
    description: 'Tulis hal-hal kecil yang bikin harimu W hari ini.',
    prompt: '### 3 hal kecil yang membuatku tersenyum hari ini:\n1. \n2. \n3. \n\n### Siapa orang yang paling aku syukuri keberadaannya hari ini?\n\n',
    icon: 'Heart',
  },
  {
    id: 'reflection',
    name: 'Deep Talk: Reflection',
    description: 'Evaluasi diri biar besok lebih slay.',
    prompt: '### Apa pencapaian terbesarku hari ini?\n\n\n### Apa yang bisa aku lakukan lebih baik besok?\n\n',
    icon: 'Sun',
  },
  {
    id: 'morning',
    name: 'Manifest It: Morning',
    description: 'Niat pagi ini biar manifestasi jadi realita.',
    prompt: '### Niatku hari ini adalah...\n\n\n### Afirmasi positif hari ini...\n\n',
    icon: 'Sunrise',
  },
  {
    id: 'dream',
    name: 'Dreamscape: Buku Mimpi',
    description: 'Catat detail mimpimu sebelum nguap dan lupa.',
    prompt: '### Detail Mimpiku:\n\n\n### Perasaan saat mimpi:\n\n',
    icon: 'Moon',
  },
  {
    id: 'brain-dump',
    name: 'Void: Brain Dump',
    description: 'Tumpahkan isi otakmu tanpa filter.',
    prompt: '',
    icon: 'Brain',
  },
];

export const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Lofi Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
  { id: 'forest', name: 'Forest Birds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'cafe', name: 'Cozy Cafe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export const MOOD_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  happy: { icon: '😊', color: 'bg-yellow-100 text-yellow-700', label: 'Bahagia' },
  calm: { icon: '😌', color: 'bg-blue-100 text-blue-700', label: 'Tenang' },
  neutral: { icon: '😐', color: 'bg-gray-100 text-gray-700', label: 'Biasa Saja' },
  sad: { icon: '😢', color: 'bg-indigo-100 text-indigo-700', label: 'Sedih' },
  tired: { icon: '😴', color: 'bg-orange-100 text-orange-700', label: 'Lelah' },
  energetic: { icon: '⚡', color: 'bg-green-100 text-green-700', label: 'Berenergi' },
};
