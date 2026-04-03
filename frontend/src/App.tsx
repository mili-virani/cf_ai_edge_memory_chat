import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { MemoryPanel } from './components/MemoryPanel';
import { ChatSession, Message } from './types';
import { Menu, BrainCircuit } from 'lucide-react';
import { extractPreferences } from './lib/memoryParser';

const API_URL = 'http://127.0.0.1:8787/chat';

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Create an initial session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !activeSessionId) {
      handleNewChat();
    } else if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions.length, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentMessages = activeSession?.messages || [];
  const currentMemories = activeSession?.memories || [];

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      memories: [],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleClearChats = () => {
    setSessions([]);
    setActiveSessionId(null);
  }

  const handleDeleteMemory = (index: number) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const mems = [...(s.memories || [])];
      mems.splice(index, 1);
      return { ...s, memories: mems };
    }));
  };

  const handleClearAllMemories = () => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, memories: [] } : s));
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId) return;

    // Check memory tracking locally
    const newPref = extractPreferences(content);
    let updatedMemories = [...(activeSession?.memories || [])];
    if (newPref && !updatedMemories.includes(newPref)) {
      updatedMemories.push(newPref);
    }

    // Optimistically update UI
    const userMessage: Message = { role: 'user', content };
    let updatedMessages = [...currentMessages, userMessage];
    
    // Auto-generate title for first message
    let sessionTitle = activeSession?.title;
    if (currentMessages.length === 0) {
      sessionTitle = content.slice(0, 30) + (content.length > 30 ? '...' : '');
    }

    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { 
        ...s, 
        title: sessionTitle || s.title, 
        messages: updatedMessages,
        memories: updatedMemories
      } : s
    ));
    
    setIsStreaming(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: content
        })
      });

      if (!response.ok) throw new Error('API Error');
      if (!response.body) throw new Error('No body returned');

      // Setup placeholder for the AI response
      const aiMessage: Message = { role: 'assistant', content: '' };
      updatedMessages = [...updatedMessages, aiMessage];
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: updatedMessages } : s
      ));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiResponseText = "";
      let buffer = "";
      
      // Stop bouncing dots, start rendering text
      setIsStreaming(false);

      while (true) {
        const { done, value } = await reader.read();
        // If done, append any remaining trailing text not closed by newline
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // CF string streaming hack payload parsing
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
            
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.response) {
                        aiResponseText += data.response;
                        // Update the last message
                        setSessions(prev => prev.map(s => {
                            if (s.id !== activeSessionId) return s;
                            const msgs = [...s.messages];
                            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: aiResponseText };
                            return { ...s, messages: msgs };
                        }));
                    }
                } catch (e) {
                   // Ignore incomplete JSON parses
                }
            }
        }
      }

    } catch (error) {
      console.error(error);
      setIsStreaming(false);
      setSessions(prev => prev.map(s => {
        if (s.id !== activeSessionId) return s;
        return { ...s, messages: [...s.messages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }] };
      }));
    } finally {
        setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#202123] text-gray-100 font-sans">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden absolute top-3 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-300 hover:text-white bg-black/20 rounded-md">
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'absolute z-40 shadow-2xl' : 'hidden'} md:block h-full transition-transform duration-300`}>
        <Sidebar 
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onClearChats={handleClearChats}
        />
      </div>

      <div className="flex-1 flex flex-col relative w-full h-full max-w-full bg-[#343541] shadow-2xl md:rounded-l-3xl overflow-hidden md:my-0 md:ml-0 md:border-l md:border-white/5 transition-all">
        
        {/* Top Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/10 shrink-0 select-none">
          <div className="flex flex-col ml-12 md:ml-0">
            <h1 className="text-[15px] font-semibold text-gray-200">Edge Memory Chat</h1>
            <span className="text-[11px] text-gray-400 font-medium tracking-wide">Cloudflare AI assistant with persistent memory</span>
          </div>
          <button 
            onClick={() => setMemoryPanelOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <BrainCircuit size={16} />
            <span className="hidden sm:inline">Memory</span>
          </button>
        </div>
        
        <ChatArea 
          messages={currentMessages}
          isStreaming={isStreaming}
          onSendSuggestion={handleSendMessage}
        />
        
        <ChatInput 
          onSend={handleSendMessage}
          disabled={isStreaming}
        />
      </div>

      <MemoryPanel
        isOpen={memoryPanelOpen}
        onClose={() => setMemoryPanelOpen(false)}
        memories={currentMemories}
        onDeleteMemory={handleDeleteMemory}
        onClearAll={handleClearAllMemories}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
