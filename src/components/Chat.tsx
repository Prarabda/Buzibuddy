import React, { useRef, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { AlertCircle, RotateCcw, Link } from 'lucide-react';
import { ChatSession, Message as MessageType, WebhookSettings } from '../lib/types';

interface ChatProps {
  activeSession: ChatSession | null;
  loading: boolean;
  error: { message: string; question: string } | null;
  settings: WebhookSettings;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export const Chat: React.FC<ChatProps> = ({
  activeSession,
  loading,
  error,
  settings,
  onSendMessage,
  onRetry,
  onOpenSettings,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = activeSession?.messages || [];

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, error]);

  return (
    <div className="flex flex-1 flex-col h-full bg-[#f8fafc] relative">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={onSendMessage} />
        ) : (
          <div className="flex flex-col w-full bg-white">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {/* Display typing animation when waiting */}
            {loading && <TypingIndicator />}

            {/* Display clean error card if request fails */}
            {error && (
              <div className="flex w-full items-start gap-4 py-8 px-4 md:px-6 bg-red-50/40 border-b border-red-100">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-bold text-red-800">
                    Connection Issue
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed max-w-xl">
                    {error.message}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={onRetry}
                      className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm shadow-red-500/10 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Retry Request
                    </button>
                    <button
                      onClick={onOpenSettings}
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Link className="h-3.5 w-3.5 text-emerald-600" /> Check Connection Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-10 shrink-0" />
          </div>
        )}
      </div>

      {/* Persistent Chat input layout */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 pb-6 pt-4 px-4 md:px-8 border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSendMessage={onSendMessage} loading={loading} />
          
          {/* Subtle helper note */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <span>
              Connected to: <span className="font-mono text-slate-500 bg-slate-50 px-1 py-0.5 rounded">{settings.webhookUrl}</span>
            </span>
            <span className="text-center sm:text-right">
              BuziBuddy can make mistakes. Verify important financial information with a certified professional.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
