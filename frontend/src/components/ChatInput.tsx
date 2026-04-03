import { Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-10 pb-6 px-4 md:px-0">
      <div className="max-w-3xl mx-auto relative">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-end w-full p-2 bg-[#40414f] rounded-2xl border border-white/10 shadow-lg focus-within:border-white/30 focus-within:shadow-[0_0_15px_-3px_rgba(255,255,255,0.05)] transition-all"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={disabled}
            className="w-full max-h-[200px] bg-transparent border-0 outline-none resize-none px-4 py-3 text-gray-100 placeholder-gray-400 m-0 overflow-y-auto leading-relaxed text-[15px]"
            rows={1}
          />
          {disabled ? (
            <div className="p-2 mb-1.5 mr-2 text-gray-400 flex-shrink-0 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`p-2 mb-1.5 mr-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                input.trim() 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-md transform hover:scale-105 active:scale-95' 
                  : 'text-gray-400 bg-transparent disabled:opacity-50'
              }`}
            >
              <Send size={18} className={input.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
            </button>
          )}
        </form>
        <div className="text-xs text-center text-gray-400 mt-3 font-medium select-none">
          Assistant may produce inaccurate information. Memory enabled.
        </div>
      </div>
    </div>
  );
}
