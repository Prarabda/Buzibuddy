import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Trash,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import { ChatSession } from '../lib/types';
import { Logo } from './Logo';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isOpen: boolean;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onStartNewChat: () => void;
  onClearAllChats: () => void;
  onClose: () => void; // Used for closing mobile overlay
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  isOpen,
  onSelectSession,
  onDeleteSession,
  onStartNewChat,
  onClearAllChats,
  onClose,
  onOpenSettings,
}) => {
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#064e3b] text-emerald-50 p-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2.5">
          <Logo size="md" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white">BuziBuddy</span>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              AI Business & Financial Consultant
            </span>
          </div>
        </div>

        {/* Mobile close button only */}
        <button
          onClick={onClose}
          id="btn-close-sidebar-mobile"
          className="rounded-lg p-1 text-emerald-300 hover:bg-emerald-800 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Start New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          onStartNewChat();
          onClose(); // Close mobile overlay after click
        }}
        id="btn-new-chat-sidebar"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700/50 bg-emerald-800/30 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-800 transition-all mb-6 shrink-0"
      >
        <Plus className="h-4.5 w-4.5" />
        New Chat
      </motion.button>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-y-auto space-y-1.5 -mx-2 px-2">
        <div className="px-2 text-[10px] font-bold tracking-widest text-emerald-400/60 uppercase mb-2">
          Recent Sessions
        </div>

        {sessions.length === 0 ? (
          <div className="px-3 py-2 text-xs text-emerald-400/40 italic">No previous chats</div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between rounded-lg transition-all text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-800/40 text-emerald-100 border border-emerald-700/30'
                      : 'text-emerald-200/70 hover:bg-emerald-800/30 hover:text-white'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose(); // Close mobile overlay
                    }}
                    className="flex-1 text-left px-3 py-2.5 truncate font-medium pr-10"
                    title={session.title}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-emerald-400/50'}`} />
                      <span className="truncate">{session.title}</span>
                    </div>
                  </button>

                  {/* Delete Individual Session Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 rounded p-1 text-emerald-400/60 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* About BuziBuddy & Action Links footer */}
      <div className="border-t border-emerald-800/50 pt-4 mt-auto space-y-3 shrink-0">
        {/* Clear All Chats */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all conversations?')) {
              onClearAllChats();
            }
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-200/80 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left"
        >
          <Trash className="h-4 w-4 text-rose-400" />
          <span>Clear Conversations</span>
        </button>

        {/* Info Card */}
        <div className="rounded-xl border border-emerald-800/30 bg-emerald-900/20 p-3 text-[11px] text-emerald-300/80 leading-relaxed">
          <div className="flex items-center gap-1 font-bold text-white mb-1.5">
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            About BuziBuddy
          </div>
          <p>
            AI-powered Legal, Financial, Corporate Advisory, and Business Consulting Assistant developed by BBIS students.          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (collapsible) */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isOpen ? 'w-64 border-r border-[#2f8f6a]/20' : 'w-0 overflow-hidden border-r-0'
        } h-screen shrink-0`}
      >
        {sidebarContent}
      </div>

      {/* Mobile Drawer (fully animated with Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black"
            />
            
            {/* Drawer sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="relative z-10 flex w-72 h-full flex-col shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
