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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-white mx-auto w-full max-w-5xl rounded-[60px] shadow-2xl relative p-10 md:p-16 overflow-hidden",
                className
              )}
            >
              {/* Modal Background Blobs */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-genz-primary rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-genz-accent rounded-full blur-[80px]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  {title && <h2 className="text-5xl font-display font-black text-genz-text tracking-tight">{title}</h2>}
                  <button
                    onClick={onClose}
                    className="p-4 bg-genz-bg hover:bg-genz-accent hover:text-white rounded-[24px] transition-all ml-auto group"
                  >
                    <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
