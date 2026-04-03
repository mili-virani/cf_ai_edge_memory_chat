import { Plus, MessageSquare, Trash2, Cpu } from 'lucide-react';
import { clsx } from 'clsx';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onClearChats: () => void;
}

export function Sidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onClearChats }: SidebarProps) {
  return (
    <div className="w-[260px] bg-[#202123] h-screen flex flex-col pt-3 pb-3 px-3">
      
      {/* Brand area */}
      <div className="px-2 mb-5 flex items-center gap-2 select-none">
        <Cpu size={24} className="text-gray-100" />
        <h2 className="text-gray-100 font-semibold tracking-wide">AI Edge</h2>
      </div>

      <div className="mb-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 w-full p-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-200 text-sm font-medium text-white shadow-sm"
        >
          <Plus size={18} className="text-gray-300" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden -mr-2 pr-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={clsx(
              "group flex items-center gap-3 w-full p-3 rounded-lg text-sm text-left hover:bg-[#2a2b32] transition-colors mb-1 shadow-none",
              activeSessionId === session.id ? "bg-[#343541] text-white" : "text-gray-300"
            )}
          >
            <MessageSquare size={16} className={clsx("shrink-0", activeSessionId === session.id ? "text-white" : "text-gray-400 group-hover:text-gray-300")} />
            <span className="truncate flex-1 max-w-[170px] select-none">{session.title}</span>
          </button>
        ))}
      </div>
      
      {sessions.length > 0 && (
        <div className="pt-3 border-t border-white/10 mt-2">
            <button
              onClick={onClearChats}
              className="group flex items-center gap-3 w-full p-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2b32] transition-colors text-sm"
            >
              <Trash2 size={16} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
              Clear chat history
            </button>
        </div>
      )}
    </div>
  );
}
