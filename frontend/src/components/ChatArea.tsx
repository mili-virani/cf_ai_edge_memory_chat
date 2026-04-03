import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';
import { Sparkles, BrainCircuit, Code, Terminal } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  onSendSuggestion?: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: <Code size={20} className="text-blue-400" />,
    text: "Help me prepare for a software engineering internship",
  },
  {
    icon: <BrainCircuit size={20} className="text-emerald-400" />,
    text: "Summarize what you remember about me",
  },
  {
    icon: <Sparkles size={20} className="text-amber-400" />,
    text: "Give me project ideas based on my skills",
  },
  {
    icon: <Terminal size={20} className="text-purple-400" />,
    text: "Explain how Cloudflare Workers work",
  }
];

export function ChatArea({ messages, isStreaming, onSendSuggestion }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto pb-40 pt-4 scroll-smooth">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-4 duration-700 fade-in">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] border border-emerald-500/30">
            <span className="text-3xl font-bold bg-gradient-to-br from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              AI
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-100 mb-2 tracking-tight text-center">Start a conversation</h2>
          <p className="text-gray-400 mb-10 max-w-md text-center text-[15px]">
            Your AI assistant with memory. It naturally learns your preferences the more you chat.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSendSuggestion && onSendSuggestion(suggestion.text)}
                className="group flex flex-col items-start gap-2 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all duration-200 text-left hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="bg-[#2b2d31] p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  {suggestion.icon}
                </div>
                <span className="text-[14px] text-gray-300 group-hover:text-gray-100 transition-colors">
                  {suggestion.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isStreaming && (
            <div className="w-full py-6 pr-4">
              <div className="max-w-3xl mx-auto flex items-center h-8 gap-3">
                 <span className="text-[14px] text-gray-400 font-medium ml-[60px]">Thinking</span>
                 <div className="w-1.5 h-4 bg-emerald-500 animate-pulse rounded-sm"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-10" />
        </div>
      )}
    </div>
  );
}
