import { User, Cpu } from 'lucide-react';
import { clsx } from 'clsx';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={clsx("w-full py-6 transition-all duration-300", isUser ? "bg-transparent" : "bg-black/10")}>
      <div className="max-w-3xl mx-auto flex gap-4 px-4 md:px-0">
        <div className={clsx(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isUser ? "bg-zinc-700" : "bg-emerald-600/90 ring-2 ring-emerald-500/20"
        )}>
          {isUser ? <User size={18} className="text-zinc-200" /> : <Cpu size={18} className="text-white" />}
        </div>
        
        <div className={clsx(
          "flex-1 leading-relaxed mt-1 text-[15px]",
          isUser ? "text-gray-200 font-normal whitespace-pre-wrap" : "text-gray-300 prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl max-w-none"
        )}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
