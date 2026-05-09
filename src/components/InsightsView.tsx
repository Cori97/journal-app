import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { JournalEntry } from '../types';
import { generateWordCloud } from '../services/ai';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOOD_CONFIG } from '../constants';
import { cn } from '../lib/utils';

export function InsightsView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await storage.getEntries();
      setEntries(data);
      if (data.length > 0) {
        const cloud = await generateWordCloud(data.map(e => e.content));
        setWords(cloud);
      }
      setLoading(false);
    };
    load();
  }, []);

  const moodData = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(moodData).map(([name, value]) => ({
    name: MOOD_CONFIG[name]?.label || name,
    value,
    color: name === 'happy' ? '#FF71CF' : name === 'calm' ? '#BEF264' : name === 'sad' ? '#7C3AED' : '#6B7280'
  }));

  if (loading) return <div className="p-12 text-center text-pixel-primary font-display text-2xl uppercase">ANALYZING SAVE DATA...</div>;

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="pixel-card col-span-1 lg:col-span-2">
          <h3 className="text-2xl font-display mb-10 text-pixel-primary">MOOD LANDSCAPE</h3>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={4}
                  stroke="#1a1a1a"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#2a2a2a',
                    border: '4px solid #fff',
                    borderRadius: '0',
                    fontFamily: 'VT323',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <p className="text-5xl font-display text-white">{entries.length}</p>
                  <p className="text-[10px] font-display text-pixel-muted">LOGS</p>
               </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-12 justify-center">
             {chartData.map(d => (
               <div key={d.name} className="flex items-center gap-3 px-3 py-1 bg-black border-2 border-white text-[10px] font-display text-white">
                 <div className="w-3 h-3" style={{ background: d.color }} />
                 {d.name}
               </div>
             ))}
          </div>
        </div>

        <div className="pixel-card flex flex-col bg-pixel-accent/10">
          <h3 className="text-2xl font-display mb-10 text-pixel-accent">VIBE CHECK</h3>
          <div className="flex flex-wrap gap-4">
            {words.map((word, i) => (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={word}
                className={cn(
                  "px-4 py-2 border-2 transition-all font-display",
                  i === 0 ? "text-3xl bg-pixel-primary text-black border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" :
                  i < 3 ? "text-xl bg-pixel-secondary text-white border-white" :
                  "text-lg bg-black text-pixel-muted border-pixel-muted"
                )}
              >
                {word}
              </motion.span>
            ))}
            {words.length === 0 && <p className="text-pixel-muted font-sans italic text-xl">NEED MORE LOGS TO GENERATE PATTERN.</p>}
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-pixel-card p-16 border-4 border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-white">
        <div className="relative z-10">
          <div className="inline-block px-4 py-2 bg-pixel-primary text-black font-display text-[10px] mb-8">ACHIEVEMENT UNLOCKED 🏆</div>
          <h3 className="text-5xl font-display mb-8 leading-tight max-w-2xl text-pixel-accent">HOW FAR IS THE JOURNEY?</h3>
          <p className="text-white/70 text-2xl font-sans max-w-xl leading-relaxed">
            You have saved <span className="text-pixel-primary font-display">{entries.length} MOMENTS</span>. 
            Every pixel of data you write is a piece of your digital soul.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pixel-primary/10 border-4 border-dashed border-pixel-primary/20 translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
