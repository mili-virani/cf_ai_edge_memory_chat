import { X, Trash2, Brain } from 'lucide-react';
import { clsx } from 'clsx';

interface MemoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  memories: string[];
  onDeleteMemory: (index: number) => void;
  onClearAll: () => void;
}

export function MemoryPanel({ isOpen, onClose, memories, onDeleteMemory, onClearAll }: MemoryPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Slide-out Panel */}
      <div className={clsx(
        "fixed inset-y-0 right-0 w-80 bg-[#2b2d31] border-l border-white/5 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-gray-200 font-semibold">
            <Brain size={18} className="text-emerald-500" />
            <h3>Memory Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            These are the distinct preferences and details recognized during this chat session. They are persisted across prompts.
          </p>
          
          {memories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 space-y-2">
              <Brain size={32} className="opacity-20" />
              <p className="text-sm">No memories saved yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {memories.map((mem, i) => (
                <li key={i} className="group flex items-start justify-between gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-sm text-gray-300 leading-snug break-words flex-1">
                    "{mem}"
                  </span>
                  <button
                    onClick={() => onDeleteMemory(i)}
                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete memory"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {memories.length > 0 && (
          <div className="p-4 border-t border-white/5">
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
            >
              <Trash2 size={16} />
              Clear all memories
            </button>
          </div>
        )}
      </div>
    </>
  );
}
