export interface Env {
  // Binding to Cloudflare AI
  AI: any;
  // Binding to ChatSession Durable Object
  CHAT_SESSION: DurableObjectNamespace;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
