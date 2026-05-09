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

  const currentMoodConfig = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral;

  return (
    <div className="relative min-h-[600px] flex flex-col overflow-hidden rounded-[40px] bg-white transition-colors duration-1000">
      {/* Dynamic Background Blobs - Mood Reactive */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none transition-all duration-1000">
        <div className={cn(
          "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-all duration-1000 blob-animate",
          mood === 'happy' ? 'bg-yellow-400' : 
          mood === 'sad' ? 'bg-indigo-600' : 
          mood === 'calm' ? 'bg-green-400' : 
          mood === 'energetic' ? 'bg-emerald-400' :
          mood === 'tired' ? 'bg-orange-400' : 'bg-genz-primary'
        )} />
        <div className={cn(
          "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] transition-all duration-1000 blob-animate",
          mood === 'happy' ? 'bg-pink-400' : 
          mood === 'sad' ? 'bg-blue-800' : 
          mood === 'calm' ? 'bg-blue-400' : 
          mood === 'energetic' ? 'bg-yellow-400' :
          mood === 'tired' ? 'bg-gray-400' : 'bg-genz-accent'
        )} style={{ animationDelay: '-5s' }} />
      </div>

      {/* Cute Illustrations (Replacing Lottie) */}
      <div className="absolute top-10 right-10 w-48 h-48 opacity-40 pointer-events-none z-0">
        <HappyPencil className="w-full h-full" />
      </div>
      
      <div className="absolute bottom-20 left-10 w-40 h-40 opacity-30 pointer-events-none z-0">
        <MindfulCloud className="w-full h-full" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none z-0">
        <SparkleIllustration className="absolute top-20 left-10 w-24 h-24" />
        <SparkleIllustration className="absolute bottom-40 right-20 w-32 h-32" />
      </div>

      {showTemplates && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
          {JOURNAL_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.prompt)}
              className="flex flex-col items-start p-8 bg-white border-2 border-transparent hover:border-genz-primary hover:bg-genz-primary/5 rounded-[40px] transition-all text-left shadow-xl hover:shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-genz-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-genz-primary/10 transition-colors" />
              <div className="w-16 h-16 bg-genz-bg rounded-[24px] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                {t.icon === 'Heart' ? '❤️' : t.icon === 'Sun' ? '☀️' : t.icon === 'Sunrise' ? '🌅' : t.icon === 'Moon' ? '🌙' : t.icon === 'Brain' ? '🧠' : '✨'}
              </div>
              <h4 className="text-3xl font-display font-black text-genz-text tracking-tight">{t.name}</h4>
              <p className="text-genz-muted font-medium opacity-70 mt-3 text-lg leading-snug">{t.description}</p>
            </button>
          ))}
          <button
            onClick={() => setShowTemplates(false)}
            className="flex flex-col items-start p-8 bg-genz-text text-white rounded-[40px] hover:scale-[1.02] active:scale-[0.98] transition-all text-left shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center text-3xl mb-6 group-hover:animate-bounce">
              📄
            </div>
            <h4 className="text-3xl font-display font-black tracking-tight">Halaman Kosong</h4>
            <p className="text-white/50 font-medium mt-3 text-lg">Mulai dari awal tanpa batasan.</p>
          </button>
        </div>
      )}

      {!showTemplates && (
        <div className="flex-1 flex flex-col space-y-8 animate-in fade-in duration-700 z-10 relative">
          <input
            type="text"
            placeholder="Ketik judul yang kece..."
            className="w-full text-5xl font-display font-black bg-transparent border-none focus:ring-0 placeholder:text-genz-muted/30 text-genz-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            {Object.entries(MOOD_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setMood(key as MoodValue)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-3",
                  mood === key 
                    ? "bg-genz-primary text-white shadow-lg shadow-genz-primary/20 scale-105" 
                    : "bg-white text-genz-muted border border-black/5 hover:border-genz-primary/30"
                )}
              >
                <span className="text-xl">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ))}
            
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="ml-auto group flex items-center gap-3 px-6 py-2.5 bg-genz-secondary text-genz-text rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Zap className={cn("w-5 h-5", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Mikir dulu..." : "Cek Mood AI"}
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm rounded-[40px] p-8 border border-white relative group focus-within:bg-white/80 transition-all">
            <textarea
              placeholder="Apa yang bikin hari ini beda? Tumpahkan semuanya di sini..."
              className="flex-1 w-full min-h-[400px] text-xl leading-relaxed bg-transparent border-none focus:ring-0 resize-none placeholder:text-genz-muted/20 font-medium"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="absolute top-8 right-8 flex flex-col items-end gap-2 pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-genz-muted/30">
                {content.length} CHARS
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-genz-muted/30">
                {content.split(/\s+/).filter(Boolean).length} WORDS
              </span>
            </div>

            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center rounded-[40px] z-20"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-genz-primary border-t-transparent rounded-full animate-spin" />
                    <SparkleIllustration className="absolute -top-4 -right-4 w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-genz-primary font-display font-black text-2xl uppercase tracking-tighter">Analyzing Vibe</p>
                    <p className="text-genz-muted font-medium text-sm mt-1">AI sedang membaca hatimu...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {photoUrl && (
              <motion.div 
                layoutId="photo"
                className="relative group mt-6"
              >
                <img src={photoUrl} alt="Hero" className="w-full h-80 object-cover rounded-[32px] shadow-2xl" />
                <button
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const url = prompt('Tempel URL fotomu di sini:');
                  if (url) setPhotoUrl(url);
                }}
                className="p-4 bg-white border border-black/5 rounded-2xl text-genz-muted hover:bg-genz-primary hover:text-white transition-all shadow-md group"
              >
                <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="p-4 bg-white border border-black/5 rounded-2xl text-genz-muted hover:bg-genz-primary hover:text-white transition-all shadow-md group"
              >
                <Layout className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="px-8 py-4 text-genz-muted hover:text-red-500 font-bold uppercase tracking-widest text-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-3 px-12 py-5 bg-genz-text text-white rounded-[24px] font-black uppercase tracking-widest text-sm hover:translate-y-[-4px] active:translate-y-0 transition-all shadow-2xl shadow-black/20"
              >
                <Save className="w-6 h-6" />
                Simpan Vibe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
