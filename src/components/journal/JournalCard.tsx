import React from 'react';
import { JournalEntry } from '../../types';
import { MOOD_CONFIG } from '../../constants';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

export function JournalCard({ entry, onClick }: JournalCardProps) {
  const mood = MOOD_CONFIG[entry.mood] || MOOD_CONFIG.neutral;

  return (
    <motion.div
      layout
      whileHover={{ translateZ: 10 }}
      onClick={onClick}
      className="group pixel-card bg-pixel-card cursor-pointer border-white flex flex-col"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2">
          <div className="inline-block px-2 py-1 bg-black border-2 border-pixel-muted text-[10px] font-display text-pixel-muted">
            {format(entry.date, 'dd/MM/yy')}
          </div>
          <h3 className="text-xl font-display text-white leading-tight group-hover:text-pixel-primary transition-colors">
            {entry.title}
          </h3>
        </div>
        <div className="w-12 h-12 bg-black border-2 border-white flex items-center justify-center text-3xl group-hover:bg-pixel-primary group-hover:text-black transition-colors">
          {mood.icon}
        </div>
      </div>

      {entry.photoUrl && (
        <div className="mb-8 border-4 border-white aspect-[16/10] overflow-hidden">
          <img
            src={entry.photoUrl}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <p className="text-pixel-muted text-xl line-clamp-3 leading-relaxed font-sans">
        {entry.content}
      </p>

      <div className="mt-auto pt-8 border-t-2 border-dashed border-white/20 flex items-center justify-between">
        <div className={cn(
          "px-4 py-2 border-2 border-white font-display text-[8px] transition-all",
          entry.mood === 'happy' ? "bg-pixel-accent text-black" :
          entry.mood === 'sad' ? "bg-pixel-secondary text-white" :
          entry.mood === 'calm' ? "bg-pixel-primary text-black" :
          "bg-white text-black"
        )}>
          {mood.label}
        </div>
        
        {entry.weatherIcon && (
          <div className="w-10 h-10 bg-black border-2 border-white flex items-center justify-center text-xl floating">
            {entry.weatherIcon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
