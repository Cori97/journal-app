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
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
      {entries.map((entry) => (
        <motion.div
          layout
          key={entry.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative group pixel-card p-2 border-white break-inside-avoid"
        >
          <img
            src={entry.photoUrl}
            alt={entry.title}
            className="w-full h-auto object-cover border-4 border-black group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-4 bottom-4 bg-black/80 border-2 border-white p-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
            <p className="text-pixel-primary text-[10px] font-display mb-2">
              {format(entry.date, 'dd/MM/yy')}
            </p>
            <h4 className="text-white font-display text-xl leading-none">{entry.title}</h4>
          </div>
        </motion.div>
      ))}
      {entries.length === 0 && (
        <div className="text-center py-24 text-pixel-muted font-display text-2xl col-span-full border-4 border-dashed border-pixel-muted">
          EMPTY FOLDER. UPLOAD PICS.
        </div>
      )}
    </div>
  );
}
