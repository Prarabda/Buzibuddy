import React from 'react';
import { Menu, Settings, MessageSquare, Bot } from 'lucide-react';
import { ChatSession } from '../lib/types';
import { Logo } from './Logo';

interface HeaderProps {
  activeSession: ChatSession | null;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSession,
  onToggleSidebar,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button for mobile and desktop */}
        <button
          onClick={onToggleSidebar}
          id="btn-toggle-sidebar"
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          title="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Branding & Active Session Title */}
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-800">
              BuziBuddy
            </span>
            <span className="hidden text-[11px] text-slate-500 font-medium sm:block max-w-[200px] md:max-w-[320px] truncate">
              {activeSession ? activeSession.title : 'AI Business & Finance Consultant'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Model badge */}
        <span className="hidden text-[10px] sm:inline-flex font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wider">
          MODEL: Buzi-v1.4
        </span>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          id="btn-settings"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
          title="Connection Settings"
        >
          <Settings className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
