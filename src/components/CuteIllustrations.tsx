import React from 'react';
import { motion } from 'motion/react';

// Pixel Art Sparkle replacement
export const SparkleIllustration = ({ className }: { className?: string }) => (
  <motion.div 
    className={className}
    animate={{ 
      scale: [1, 1.2, 1],
    }}
    transition={{ 
      duration: 1, 
      repeat: Infinity, 
      ease: "steps(2)" 
    }}
  >
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="0" width="10" height="40" fill="#BEF264" />
      <rect x="0" y="15" width="40" height="10" fill="#BEF264" />
      <rect x="15" y="15" width="10" height="10" fill="white" />
    </svg>
  </motion.div>
);

// Pixel Art Ghost/Character
export const PixelGhost = ({ className }: { className?: string }) => (
  <motion.div 
    className={className}
    animate={{ 
      y: [0, -10, 0],
    }}
    transition={{ 
      duration: 2, 
      repeat: Infinity, 
      ease: "steps(4)" 
    }}
  >
    <svg width="80" height="80" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="4" height="6" fill="white" />
      <rect x="1" y="2" width="6" height="4" fill="white" />
      <rect x="2" y="3" width="1" height="1" fill="black" />
      <rect x="5" y="3" width="1" height="1" fill="black" />
      <rect x="1" y="6" width="1" height="1" fill="white" />
      <rect x="3" y="6" width="1" height="1" fill="white" />
      <rect x="5" y="6" width="1" height="1" fill="white" />
      <rect x="7" y="6" width="1" height="1" fill="white" />
    </svg>
  </motion.div>
);

// Pixel Art Pencil/Tool
export const PixelPencil = ({ className }: { className?: string }) => (
  <motion.div 
    className={className}
    animate={{ 
      rotate: [0, 5, 0],
    }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "steps(3)" 
    }}
  >
    <svg width="60" height="120" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="2" height="8" fill="#FF00FF" />
      <rect x="2" y="9" width="2" height="2" fill="#FDE68A" />
      <rect x="2" y="11" width="2" height="1" fill="black" />
      <rect x="2" y="0" width="2" height="1" fill="#FF71CF" />
    </svg>
  </motion.div>
);

export const MindfulCloud = PixelGhost;
export const HappyPencil = PixelPencil;
