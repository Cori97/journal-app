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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bento-card col-span-1 lg:col-span-2">
          <h3 className="text-4xl font-display font-black mb-8">Mood Landscape</h3>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                  <p className="text-5xl font-black text-genz-primary">{entries.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-genz-muted">Refleksi</p>
               </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-8 justify-center">
             {chartData.map(d => (
               <div key={d.name} className="flex items-center gap-3 px-4 py-2 bg-genz-bg rounded-2xl text-[10px] font-black uppercase tracking-widest text-genz-muted">
                 <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                 {d.name}
               </div>
             ))}
          </div>
        </div>

        <div className="bento-card flex flex-col">
          <h3 className="text-4xl font-display font-black mb-8">Vibe Check</h3>
          <div className="flex flex-wrap gap-3">
            {words.map((word, i) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: Math.random() * 10 - 5 }}
                transition={{ delay: i * 0.05 }}
                key={word}
                className={cn(
                  "px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all",
                  i === 0 ? "text-4xl bg-genz-primary text-white shadow-xl shadow-genz-primary/20" :
                  i < 3 ? "text-xl bg-genz-accent/10 text-genz-accent" :
                  "text-sm bg-genz-bg text-genz-muted"
                )}
              >
                {word}
              </motion.span>
            ))}
            {words.length === 0 && <p className="text-genz-muted font-bold italic opacity-50">Tulis lebih banyak biar ketauan polanya.</p>}
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-genz-text p-16 rounded-[60px] text-white">
        <div className="relative z-10">
          <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Big Picture 🌍</div>
          <h3 className="text-6xl font-display font-black mb-6 leading-tight max-w-2xl">Sudah sejauh mana perjalananmu?</h3>
          <p className="text-white/50 text-xl font-medium max-w-lg leading-relaxed">
            Kamu udah nyimpen <span className="text-white font-black">{entries.length} momen</span> berharga. 
            Setiap kata yang kamu tulis adalah bagian dari sejarah dirimu sendiri.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-genz-primary/30 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-genz-accent/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-genz-secondary/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
