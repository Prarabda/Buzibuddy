import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, Clock, Copy, Check } from 'lucide-react';
import { Message as MessageType } from '../lib/types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = React.useState(false);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex w-full items-start gap-4 py-6 px-4 md:px-6 border-b transition-colors duration-150 ${
        isAssistant
          ? 'bg-[#f8fafc]/50 border-slate-100'
          : 'bg-white border-slate-100'
      }`}
    >
      {/* Avatar Container */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-sm ${
          isAssistant
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
            : 'bg-slate-100 text-slate-700'
        }`}
      >
        {isAssistant ? 'B' : <User className="h-4 w-4" />}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Message Header */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-slate-800">
              {isAssistant ? 'BuziBuddy AI' : 'You'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              <Clock className="h-3 w-3" />
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Copy Message Button */}
          <button
            onClick={copyToClipboard}
            className="rounded-md p-1 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Message Body with Beautiful Markdown styles */}
        <div className="text-sm sm:text-base leading-relaxed text-slate-800 overflow-x-auto">
          {isAssistant ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative my-4 rounded-lg overflow-hidden border border-slate-100">
                      <div className="flex items-center justify-between bg-slate-900 px-4 py-1.5 text-xs font-mono text-slate-400">
                        <span>{match[1]}</span>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0 }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className="rounded bg-emerald-50/50 px-1.5 py-0.5 font-mono text-xs font-semibold text-emerald-800 border border-emerald-100/50"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Beautiful structural mapping
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                h1: ({ children }) => <h1 className="text-lg font-bold text-slate-900 mt-4 mb-2 first:mt-0 border-b border-slate-100 pb-1">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold text-slate-900 mt-3 mb-1.5 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold text-slate-800 mt-2 mb-1 first:mt-0">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-700">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-700">{children}</ol>,
                li: ({ children }) => <li className="text-slate-700">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-emerald-600 bg-emerald-50/20 pl-4 py-1.5 pr-2 my-3 rounded-r italic text-slate-600 text-sm">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className="font-bold text-emerald-950">{children}</strong>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-semibold underline hover:text-emerald-700 transition-colors"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-lg border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-emerald-50/50 text-emerald-900 font-bold">{children}</thead>,
                tbody: ({ children }) => <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>,
                tr: ({ children }) => <tr className="hover:bg-slate-50/50 transition-colors">{children}</tr>,
                th: ({ children }) => <th className="px-4 py-2.5 font-bold">{children}</th>,
                td: ({ children }) => <td className="px-4 py-2.5 text-slate-600">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
