import React from 'react';
import { motion } from 'motion/react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full items-start gap-4 py-6 px-4 md:px-6 bg-[#f8fafc]/50 border-b border-slate-100">
      {/* Bot Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm shadow-emerald-600/20">
        B
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold tracking-tight text-slate-800">
          BuziBuddy AI
        </span>
        
        {/* Animated Dots container */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white px-4 py-3 border border-slate-100 shadow-sm w-fit mt-1">
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="h-2 w-2 rounded-full bg-emerald-600"
          />
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
            className="h-2 w-2 rounded-full bg-emerald-500"
          />
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            className="h-2 w-2 rounded-full bg-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
