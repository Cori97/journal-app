import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto pt-10 pb-10 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-pixel-card mx-auto w-full max-w-4xl border-8 border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative p-8 md:p-12",
                className
              )}
            >
              <div className="flex items-center justify-between mb-10">
                {title && <h2 className="text-3xl font-display text-white uppercase">{title}</h2>}
                <button
                  onClick={onClose}
                  className="p-3 bg-pixel-secondary text-white border-4 border-white hover:scale-110 active:translate-y-1 ml-auto"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
