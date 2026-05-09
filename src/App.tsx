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
    <div className="min-h-screen pb-24 lg:pb-0 lg:flex bg-pixel-bg selection:bg-pixel-accent/50 pixel-grid">
      {/* Sidebar (Desktop) - Pixel Style */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 w-20 hidden lg:flex flex-col items-center py-10 bg-pixel-card border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none z-40">
        <div className="mb-12">
          <div className="w-12 h-12 bg-pixel-primary border-4 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
            <span className="text-xl font-display text-black">Z</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "p-3 transition-all group relative",
                currentView === item.id ? "bg-pixel-accent text-black scale-110 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "text-pixel-muted hover:text-pixel-text"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="absolute left-full ml-10 px-3 py-2 bg-white text-black text-[10px] font-display uppercase tracking-widest border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => openEditor()}
          className="mt-auto p-4 bg-pixel-secondary text-white border-2 border-white hover:scale-110 active:translate-x-1 active:translate-y-1 transition-all"
        >
          <Plus className="w-7 h-7" />
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-40 lg:flex h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-12 md:px-16 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/20 text-pixel-primary border-2 border-pixel-primary text-[12px] font-display uppercase"
                >
                  <span className="w-2 h-2 bg-pixel-primary" />
                  Hi, Achmad!
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl md:text-5xl font-display text-white leading-tight"
                >
                  Apa ceritamu <span className="text-pixel-accent">hari ini?</span>
                </motion.h1>
              </div>

              {currentView === 'home' && (
                <div className="relative w-full md:w-96 group">
                  <div className="relative bg-pixel-card border-4 border-white flex items-center px-4 py-2">
                    <Search className="w-5 h-5 text-pixel-muted mr-3" />
                    <input
                      type="text"
                      placeholder="CARI VIBE..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 w-full text-xl font-sans uppercase tracking-widest placeholder:text-pixel-muted"
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
                        className="pixel-card bg-pixel-secondary border-black"
                        onClick={() => openEditor(onThisDay)}
                      >
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <div className="inline-block px-3 py-1 bg-white text-black mb-4 font-display text-[8px]">KILAS BALIK</div>
                            <h3 className="text-2xl font-display text-white">INGET INI GAK?</h3>
                            <p className="text-white mt-4 text-xl font-sans italic">"{onThisDay.title}"</p>
                          </div>
                          <div className="w-16 h-16 bg-black flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                            💾
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {filteredEntries.map((entry) => (
                        <JournalCard 
                          key={entry.id} 
                          entry={entry} 
                          onClick={() => openEditor(entry)}
                        />
                      ))}
                      {filteredEntries.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-black/30 border-4 border-dashed border-pixel-muted">
                          <div className="text-8xl mb-8">👾</div>
                          <p className="text-pixel-muted font-display text-2xl mb-10 tracking-tighter">LEVEL KOSONG...</p>
                          <button 
                            onClick={() => openEditor()}
                            className="pixel-btn px-12 py-6 text-xl"
                          >
                            MULAI QUEST BARU
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentView === 'gallery' && <GalleryView />}
                {currentView === 'insights' && <InsightsView />}
                
                {currentView === 'settings' && (
                  <div className="max-w-2xl pixel-card">
                    <h2 className="text-3xl font-display mb-12 text-pixel-secondary">OPTIONS</h2>
                    <div className="space-y-12">
                      <div className="flex items-center justify-between p-8 bg-black/50 border-2 border-white">
                        <div>
                          <h4 className="font-display text-[12px] text-pixel-primary">USER_ID</h4>
                          <p className="text-2xl text-white font-sans mt-2">Achmad Cori</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-8 bg-black/50 border-2 border-white">
                        <div>
                          <h4 className="font-display text-[12px] text-pixel-primary">STORAGE</h4>
                          <p className="text-2xl text-white font-sans mt-2">Local Browser Storage</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (confirm('FORMAT STORAGE? ALL PROGRESS WILL BE LOST.')) {
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="text-red-500 font-display text-[10px] hover:underline px-4 py-2 border-2 border-red-500"
                        >
                          DELETE SAVE
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
        <aside className="hidden lg:flex w-[400px] bg-pixel-card border-l-8 border-black flex-col p-12 overflow-y-auto">
          <div className="space-y-20">
            <div className="space-y-8">
              <h4 className="text-[12px] font-display text-pixel-muted">WORLD STATS</h4>
              <div className="p-10 bg-black/50 border-4 border-pixel-primary shadow-[8px_8px_0px_0px_rgba(0,255,0,0.2)]">
                <p className="text-7xl font-display text-pixel-primary">{entries.length}</p>
                <p className="text-[10px] text-pixel-muted mt-4 font-display">TOTAL REFLECTIONS</p>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[12px] font-display text-pixel-muted">MANA LEVEL</h4>
              <div className="p-8 bg-black/50 border-4 border-white">
                <div className="h-8 bg-black border-2 border-white p-1">
                   <div className="bg-pixel-primary h-full transition-all duration-1000" style={{ width: '66%' }} />
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] font-display text-pixel-muted">LOW</span>
                  <span className="text-[10px] font-display text-pixel-muted">MAX</span>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="p-10 border-4 border-dashed border-pixel-accent text-center bg-pixel-accent/5">
                <p className="text-2xl font-sans leading-relaxed text-pixel-accent italic">
                  "Satu paragraf hari ini, satu sejarah masa depan."
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 lg:hidden bg-pixel-card border-4 border-white z-40 flex items-center justify-around px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={cn(
              "p-3 transition-all",
              currentView === item.id ? "bg-pixel-primary text-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "text-pixel-muted"
            )}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
        <button
          onClick={() => openEditor()}
          className="p-4 bg-pixel-secondary text-white border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-12 active:translate-y-0 transition-transform"
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
