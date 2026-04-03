import { Message } from './types';

export const SYSTEM_PROMPT = `You are a helpful, smart, and concise AI assistant. You answer queries factually and politely.`;

export function buildChatMessages(userMessage: string, history: Message[], preferences: string[]): Message[] {
  let contextPrompt = SYSTEM_PROMPT;
  
  if (preferences.length > 0) {
    contextPrompt += `\n\nUser Preferences/Memory:\n` + preferences.map(p => `- ${p}`).join('\n');
  }

  const messages: Message[] = [
    { role: 'system', content: contextPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  return messages;
}

// Simple rule-based extraction for preferences
export function extractPreferences(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.startsWith("my name is") || lowerMsg.includes("my name is")) {
    return message;
  }
  if (lowerMsg.startsWith("i prefer") || lowerMsg.includes("i prefer")) {
    return message;
  }
  if (lowerMsg.startsWith("i am interested in") || lowerMsg.includes("i am interested in")) {
    return message;
  }
  if (lowerMsg.startsWith("i am applying for") || lowerMsg.includes("i am applying for")) {
    return message;
  }
  
  return null;
}
