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
