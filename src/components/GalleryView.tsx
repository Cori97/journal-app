import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { JournalEntry } from '../types';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function GalleryView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await storage.getEntries();
      setEntries(data.filter(e => e.photoUrl));
    };
    load();
  }, []);

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
      {entries.map((entry) => (
        <motion.div
          layout
          key={entry.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group rounded-[40px] overflow-hidden break-inside-avoid bento-card p-2 border-none"
        >
          <img
            src={entry.photoUrl}
            alt={entry.title}
            className="w-full h-auto object-cover rounded-[38px] group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-2 bottom-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[30px] p-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
            <p className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">
              {format(entry.date, 'MMM d, yyyy')}
            </p>
            <h4 className="text-white font-display font-black text-2xl leading-none">{entry.title}</h4>
          </div>
        </motion.div>
      ))}
      {entries.length === 0 && (
        <div className="text-center py-24 text-genz-muted font-display text-2xl font-bold col-span-full">
          Gak ada foto nih. Coba upload yang kece!
        </div>
      )}
    </div>
  );
}
