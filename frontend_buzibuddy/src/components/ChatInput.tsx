import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter key sends the message, but Shift+Enter inserts a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize the height of the textarea based on content length
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputValue]);

  return (
    <div className="relative w-full group">
      {/* Glow highlight behind container */}
      <div className="absolute inset-0 bg-emerald-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
      
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? 'Buddy is thinking...' : 'Ask BuziBuddy...'}
          disabled={loading}
          className="flex-1 max-h-[180px] min-h-[24px] overflow-y-auto border-0 bg-transparent py-1.5 px-3 text-sm sm:text-base outline-none resize-none text-slate-800 placeholder-slate-400 disabled:opacity-50 focus:ring-0"
        />
        
        <div className="flex items-center gap-1.5 self-end shrink-0 pb-1 pr-1">
          <span className="hidden text-[10px] text-slate-400 font-semibold uppercase tracking-wider sm:flex items-center gap-0.5 mr-1.5 select-none">
            Send <CornerDownLeft className="h-3 w-3 text-slate-400" />
          </span>
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            id="btn-send-message"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition-all hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <SendHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
