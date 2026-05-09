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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        rotate: 1,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group bento-card cursor-pointer flex flex-col hover:shadow-2xl hover:shadow-genz-primary/10"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-genz-bg rounded-full text-[10px] font-black uppercase tracking-widest text-genz-muted">
            {format(entry.date, 'MMM d, yyyy')}
          </div>
          <h3 className="text-3xl font-display font-black text-genz-text leading-tight group-hover:text-genz-primary transition-colors">
            {entry.title}
          </h3>
        </div>
        <div className="w-14 h-14 bg-genz-bg rounded-2xl flex items-center justify-center text-3xl group-hover:bg-genz-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-12">
          {mood.icon}
        </div>
      </div>

      {entry.photoUrl && (
        <div className="mb-6 rounded-[32px] overflow-hidden aspect-[16/10]">
          <img
            src={entry.photoUrl}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <p className="text-genz-muted text-lg line-clamp-3 leading-relaxed font-medium">
        {entry.content}
      </p>

      <div className="mt-auto pt-6 border-t border-genz-bg flex items-center justify-between">
        <div className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
          entry.mood === 'happy' ? "bg-genz-accent/10 text-genz-accent" :
          entry.mood === 'sad' ? "bg-genz-primary/10 text-genz-primary" :
          entry.mood === 'calm' ? "bg-genz-secondary/20 text-genz-secondary" :
          "bg-genz-bg text-genz-muted"
        )}>
          {mood.label}
        </div>
        
        {entry.weatherIcon && (
          <div className="w-10 h-10 bg-genz-bg rounded-xl flex items-center justify-center text-xl floating">
            {entry.weatherIcon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
