import React, { useState, useRef } from 'react';
import { AMBIENT_SOUNDS } from '../constants';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

export function AmbientSounds() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
      if (sound) {
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = new Audio(sound.url);
        audioRef.current.loop = true;
        audioRef.current.play();
        setActiveSound(soundId);
        setIsPlaying(true);
      }
    }
  };

  const stopAll = () => {
    audioRef.current?.pause();
    setActiveSound(null);
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 flex items-center gap-2">
      <div className="flex gap-2">
        {AMBIENT_SOUNDS.map(sound => (
          <button
            key={sound.id}
            onClick={() => toggleSound(sound.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 border",
              activeSound === sound.id 
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" 
                : "bg-white/80 backdrop-blur-sm text-gray-600 border-gray-100 hover:bg-white"
            )}
          >
            {activeSound === sound.id && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {sound.name}
          </button>
        ))}
      </div>
      {activeSound && (
        <button
          onClick={stopAll}
          className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all border border-red-100"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
