import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MindfulCloud, HappyPencil, SparkleIllustration } from '../CuteIllustrations';
import { storage } from '../../services/storage';
import { JournalEntry, MoodValue } from '../../types';
import { JOURNAL_TEMPLATES, MOOD_CONFIG } from '../../constants';
import { analyzeMood } from '../../services/ai';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, Save, Trash2, Layout, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface EditorProps {
  entry: Partial<JournalEntry> | null;
  onSave: () => void;
  onClose: () => void;
}

export function Editor({ entry, onSave, onClose }: EditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<MoodValue>(entry?.mood || 'neutral');
  const [photoUrl, setPhotoUrl] = useState(entry?.photoUrl || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!entry?.id);

  const handleSave = async () => {
    if (!content.trim()) return;

    const newEntry: JournalEntry = {
      id: entry?.id || crypto.randomUUID(),
      userId: 'default-user',
      title: title || format(new Date(), 'eeee, d MMMM'),
      content,
      mood,
      photoUrl,
      date: entry?.date || new Date(),
      createdAt: entry?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    await storage.saveEntry(newEntry);
    onSave();
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeMood(content);
    setMood(result.mood);
    setIsAnalyzing(false);
  };

  const applyTemplate = (templateContent: string) => {
    setContent(templateContent);
    setShowTemplates(false);
  };

  return (
    <div className="relative min-h-[600px] flex flex-col overflow-hidden pixel-card bg-pixel-card border-white">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none pixel-grid" />

      {/* Cute Illustrations */}
      <div className="absolute top-10 right-10 w-24 h-48 opacity-40 pointer-events-none z-0">
        <HappyPencil className="w-full h-full" />
      </div>
      
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-30 pointer-events-none z-0">
        <MindfulCloud className="w-full h-full" />
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <SparkleIllustration className="absolute top-20 left-10 w-12 h-12" />
        <SparkleIllustration className="absolute bottom-40 right-20 w-16 h-16" />
      </div>

      {showTemplates && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
          {JOURNAL_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.prompt)}
              className="group relative flex flex-col items-start p-8 bg-black/40 border-4 border-white hover:bg-pixel-primary hover:border-black transition-all text-left"
            >
              <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {t.icon === 'Heart' ? '❤️' : t.icon === 'Sun' ? '☀️' : t.icon === 'Sunrise' ? '🌅' : t.icon === 'Moon' ? '🌙' : '🧠'}
              </div>
              <h4 className="text-xl font-display text-white group-hover:text-black">{t.name}</h4>
              <p className="font-sans text-pixel-muted group-hover:text-black/70 mt-4 text-lg">{t.description}</p>
            </button>
          ))}
          <button
            onClick={() => setShowTemplates(false)}
            className="flex flex-col items-start p-8 bg-pixel-secondary border-4 border-black text-white hover:scale-[1.02] active:translate-x-1 active:translate-y-1 transition-all text-left"
          >
            <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center text-3xl mb-6">
              📄
            </div>
            <h4 className="text-xl font-display">KERTAS KOSONG</h4>
            <p className="font-sans text-white/70 mt-4 text-lg">Mulai tanpa batas.</p>
          </button>
        </div>
      )}

      {!showTemplates && (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-500 z-10 relative">
          <input
            type="text"
            placeholder="JUDUL QUEST..."
            className="w-full text-3xl font-display bg-transparent border-none focus:ring-0 placeholder:text-pixel-muted/30 text-white uppercase"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-wrap gap-4">
            {Object.entries(MOOD_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setMood(key as MoodValue)}
                className={cn(
                  "px-4 py-2 border-4 font-display text-[8px] transition-all flex items-center gap-3",
                  mood === key 
                    ? "bg-pixel-accent text-black border-white translate-y-1" 
                    : "bg-black text-pixel-muted border-pixel-muted hover:border-white"
                )}
              >
                <span className="text-xl">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ))}
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="ml-auto group pixel-btn bg-pixel-secondary text-white border-white flex items-center gap-3"
            >
              <Zap className={cn("w-5 h-5", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "RECOGNIZING..." : "SCAN VIBE"}
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-black/50 border-4 border-white p-8 relative">
            <textarea
              placeholder="APA CERITAMU?"
              className="flex-1 w-full min-h-[400px] text-2xl leading-relaxed bg-transparent border-none focus:ring-0 resize-none placeholder:text-pixel-muted/20 font-sans text-white capitalize-first"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {photoUrl && (
              <div className="relative group mt-8 border-4 border-white overflow-hidden">
                <img src={photoUrl} alt="Hero" className="w-full h-80 object-cover" />
                <button
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-4 right-4 p-3 bg-red-500 text-white border-2 border-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  const url = prompt('PHOTO_URL:');
                  if (url) setPhotoUrl(url);
                }}
                className="p-4 bg-black border-4 border-white text-pixel-primary hover:bg-pixel-primary hover:text-black transition-all"
              >
                <ImageIcon className="w-7 h-7" />
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="p-4 bg-black border-4 border-white text-pixel-accent hover:bg-pixel-accent hover:text-black transition-all"
              >
                <Layout className="w-7 h-7" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={onClose}
                className="px-8 py-4 text-pixel-muted hover:text-red-500 font-display text-[10px] uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                className="pixel-btn px-12 py-5 text-lg"
              >
                SAVE LOG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
