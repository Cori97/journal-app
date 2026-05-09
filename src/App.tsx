/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { JournalEntry } from './types';
import { JournalCard } from './components/journal/JournalCard';
import { Editor } from './components/journal/Editor';
import { Modal } from './components/Modal';
import { InsightsView } from './components/InsightsView';
import { GalleryView } from './components/GalleryView';
import { AmbientSounds } from './components/AmbientSounds';
import { Plus, Home, Image as ImageIcon, BarChart3, Settings, Search } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { SparkleIllustration } from './components/CuteIllustrations';
import { cn } from './lib/utils';

type View = 'home' | 'gallery' | 'insights' | 'settings';

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadEntries = async () => {
    const data = await storage.getEntries();
    setEntries(data.sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onThisDay = entries.find(e => {
    const today = new Date();
    return e.date.getDate() === today.getDate() && 
           e.date.getMonth() === today.getMonth() && 
           e.date.getFullYear() < today.getFullYear();
  });

  const openEditor = (entry?: JournalEntry) => {
    setSelectedEntry(entry || null);
    setIsEditorOpen(true);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:flex bg-[#F8F9FF] selection:bg-genz-accent/30 overflow-hidden relative bg-mesh">
      {/* Background Blobs - Enhanced Motion */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-genz-primary/15 rounded-full blob-animate" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-genz-accent/15 rounded-full blob-animate" style={{ animationDelay: '-7s', animationDirection: 'reverse' }} />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-genz-secondary/15 rounded-full blob-animate" style={{ animationDelay: '-12s' }} />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-genz-primary/5 rounded-full blob-animate" style={{ animationDelay: '-18s', animationDuration: '40s' }} />
      </div>

      {/* Sidebar (Desktop) - Floating Style */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 w-20 hidden lg:flex flex-col items-center py-10 glass rounded-[32px] z-40 transition-all hover:w-24">
        <div className="mb-12">
          <div className="w-12 h-12 fun-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-genz-primary/20 rotate-3 animate-pulse">
            <span className="text-xl font-display font-bold text-white">Z</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "p-4 rounded-2xl transition-all group relative",
                currentView === item.id ? "bg-genz-primary text-white shadow-lg shadow-genz-primary/30" : "text-genz-muted hover:text-genz-primary hover:bg-genz-primary/5"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="absolute left-full ml-6 px-3 py-1.5 bg-genz-text text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => openEditor()}
          className="mt-auto p-4 bg-genz-secondary text-genz-text rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-40 lg:flex h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-12 md:px-16 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 z-10 relative">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-genz-primary/10 text-genz-primary rounded-full text-[10px] font-bold uppercase tracking-widest"
                >
                  <span className="w-2 h-2 bg-genz-primary rounded-full animate-ping" />
                  Yo, Achmad!
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", damping: 15 }}
                  className="text-6xl md:text-8xl font-display font-black tracking-tight text-genz-text leading-[0.85]"
                >
                  Apa ceritamu <span className="relative inline-block text-transparent bg-clip-text fun-gradient py-2">
                    hari ini?
                    <div className="absolute -top-12 -right-12 w-24 h-24 pointer-events-none hidden md:block">
                      <SparkleIllustration className="w-full h-full" />
                    </div>
                  </span>
                </motion.h1>
              </div>

              {currentView === 'home' && (
                <div className="relative w-full md:w-80 group">
                  <div className="absolute inset-0 bg-genz-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative glass rounded-3xl flex items-center px-4 py-3">
                    <Search className="w-5 h-5 text-genz-muted mr-3" />
                    <input
                      type="text"
                      placeholder="Cari vibe sebelumnya..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium placeholder:text-genz-muted"
                    />
                  </div>
                </div>
              )}
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentView === 'home' && (
                  <div className="space-y-16">
                    {onThisDay && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-1 rounded-[44px] bg-gradient-to-r from-genz-primary via-genz-accent to-genz-secondary shadow-2xl shadow-genz-primary/20"
                        onClick={() => openEditor(onThisDay)}
                      >
                        <div className="bg-white p-10 rounded-[42px] relative overflow-hidden group cursor-pointer">
                          <div className="relative z-10 flex items-center justify-between">
                            <div>
                              <div className="inline-block px-3 py-1 bg-genz-primary/10 text-genz-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Masa Lalu ✨</div>
                              <h3 className="text-4xl font-display font-black leading-tight text-genz-text">Inget ini gak?</h3>
                              <p className="text-genz-muted mt-4 text-xl font-medium italic opacity-70">"{onThisDay.title}"</p>
                            </div>
                            <div className="w-20 h-20 bg-genz-bg rounded-3xl flex items-center justify-center text-4xl group-hover:bg-genz-primary group-hover:text-white transition-all duration-500 shadow-inner">
                              🕰️
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 w-80 h-80 bg-genz-accent/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-genz-primary/20 transition-all duration-700" />
                        </div>
                      </motion.div>
                    )}

                    <motion.div 
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 gap-12"
                    >
                      {filteredEntries.map((entry) => (
                        <JournalCard 
                          key={entry.id} 
                          entry={entry} 
                          onClick={() => openEditor(entry)}
                        />
                      ))}
                      {filteredEntries.length === 0 && (
                        <div className="col-span-full py-32 text-center">
                          <div className="text-8xl mb-8 animate-bounce">✍️</div>
                          <p className="text-genz-muted font-display text-4xl font-black mb-10">Bagaimanakah hari ini?</p>
                          <button 
                            onClick={() => openEditor()}
                            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-genz-primary text-white rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-genz-primary/30 hover:scale-105 transition-all active:scale-95 overflow-hidden"
                          >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                            Mulai Tulis Vibe-mu
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}

                {currentView === 'gallery' && <GalleryView />}
                {currentView === 'insights' && <InsightsView />}
                
                {currentView === 'settings' && (
                  <div className="max-w-2xl bg-white rounded-[40px] p-12 bento-card border-none">
                    <h2 className="text-4xl font-display font-black mb-12">Settings</h2>
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-8 bg-genz-bg rounded-[32px]">
                        <div>
                          <h4 className="font-bold text-genz-text">User Profile</h4>
                          <p className="text-sm text-genz-muted">Achmad Cori</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-8 bg-genz-bg rounded-[32px]">
                        <div>
                          <h4 className="font-bold text-genz-text">Data Storage</h4>
                          <p className="text-sm text-genz-muted">Local Browser Storage</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure? This will delete all entries.')) {
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline"
                        >
                          Reset App
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Panel (Desktop) */}
        <aside className="hidden lg:flex w-[360px] bg-white border-l border-white flex-col p-12 overflow-y-auto z-10 relative">
          <div className="space-y-16">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-genz-muted">Vibe Status</h4>
              <div className="p-10 bg-genz-bg rounded-[40px] shadow-inner">
                <p className="text-6xl font-display font-black text-genz-primary">{entries.length}</p>
                <p className="text-[10px] text-genz-muted mt-4 font-black uppercase tracking-widest">Total Reflections</p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-genz-muted">Mood Energy</h4>
              <div className="p-8 bg-genz-bg rounded-[40px] overflow-hidden">
                <div className="h-4 bg-white rounded-full overflow-hidden flex shadow-inner">
                   <div className="bg-genz-primary w-2/3 h-full rounded-full transition-all duration-1000" />
                   <div className="bg-genz-accent w-1/3 h-full transition-all duration-1000 delay-500" />
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-[8px] font-black uppercase text-genz-muted">Chill</span>
                  <span className="text-[8px] font-black uppercase text-genz-muted">Pumped</span>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="p-10 bg-genz-primary/5 border-2 border-dashed border-genz-primary/10 rounded-[40px] text-center rotate-1">
                <p className="text-lg font-display font-bold leading-relaxed text-genz-primary/60 italic">
                  "Satu paragraf hari ini, satu sejarah masa depan."
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 lg:hidden glass z-40 flex items-center justify-around px-4 rounded-[32px]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={cn(
              "p-3 rounded-2xl transition-all",
              currentView === item.id ? "bg-genz-primary text-white shadow-lg" : "text-genz-muted"
            )}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
        <button
          onClick={() => openEditor()}
          className="p-4 bg-genz-secondary text-genz-text rounded-[24px] shadow-2xl -translate-y-8 active:scale-90 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </button>
      </nav>

      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={selectedEntry ? "Edit Entry" : "New Reflection"}
      >
        <Editor 
          entry={selectedEntry} 
          onSave={() => {
            setIsEditorOpen(false);
            loadEntries();
          }} 
          onClose={() => setIsEditorOpen(false)}
        />
      </Modal>

      <AmbientSounds />
    </div>
  );
}
