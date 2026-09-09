import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HelpCircle, ArrowUpRight, TrendingUp, Briefcase, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLES = [
  {
    text: 'How do I register a company?',
    icon: Briefcase,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    text: 'Explain working capital.',
    icon: TrendingUp,
    color: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    text: 'What is a balance sheet?',
    icon: FileText,
    color: 'bg-green-50 text-green-600 border-green-100',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      {/* Centered Decorative Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative mb-6"
      >
        <Logo size="lg" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-600 shadow-md border border-emerald-600/10"
        >
          <Sparkles className="h-3 w-3" />
        </motion.div>
      </motion.div>

      {/* Hero Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI Business & Finance Consultant
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
      >
        Welcome to{' '}
        <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
          BuziBuddy
        </span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-base text-slate-500 sm:text-lg max-w-md"
      >
        Your personal Business & Finance AI Consultant. Ask me anything about registration, taxes, or growth strategy.
      </motion.p>

      {/* Prompt Examples Container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10 w-full"
      >
        <h2 className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          <HelpCircle className="h-3.5 w-3.5" /> Example Prompts
        </h2>
        
        <div className="grid gap-3 sm:grid-cols-3">
          {EXAMPLES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPrompt(item.text)}
                id={`btn-example-${index}`}
                className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white/60 p-4 text-center transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-lg hover:shadow-emerald-600/5 group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${item.color} mb-3 shadow-inner`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                  "{item.text}"
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  Ask Buddy <ArrowUpRight className="ml-0.5 h-3.5 w-3.5" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
