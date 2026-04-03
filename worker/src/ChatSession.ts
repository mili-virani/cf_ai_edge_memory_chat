import { Env, ChatRequest, Message } from './types';
import { buildChatMessages, extractPreferences } from './prompts';

export class ChatSession {
  state: DurableObjectState;
  env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json<ChatRequest>().catch(() => null);
      if (!body || !body.message) {
        return new Response(JSON.stringify({ error: 'Message input is required' }), { status: 400 });
      }

      // Load existing state from storage
      const history = (await this.state.storage.get<Message[]>('history')) || [];
      const preferences = (await this.state.storage.get<string[]>('preferences')) || [];

      // Extract new preferences based on rules
      const newPreference = extractPreferences(body.message);
      let updatedPreferences = preferences;
      if (newPreference && !preferences.includes(newPreference)) {
        updatedPreferences = [...preferences, newPreference];
        await this.state.storage.put('preferences', updatedPreferences);
      }

      // Build context messages
      const messages = buildChatMessages(body.message, history, updatedPreferences);

      // Call Cloudflare AI with streaming enabled
      const stream = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
        messages: messages,
        stream: true,
        max_tokens: 2048
      }) as ReadableStream;

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Process the stream as it flows to the client
      (async () => {
        let fullResponse = "";
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            await writer.write(value);
            
            buffer += decoder.decode(value, { stream: true });
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
              const line = buffer.slice(0, newlineIndex).trim();
              buffer = buffer.slice(newlineIndex + 1);
              if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.response) fullResponse += data.response;
                } catch (e) {}
              }
            }
          }
        } finally {
          await writer.close();
          
          // Stream completed, now update history
          const updatedHistory = [
            ...history,
            { role: 'user', content: body.message } as Message,
            { role: 'assistant', content: fullResponse } as Message
          ];
          const trimmedHistory = updatedHistory.slice(-20);
          await this.state.storage.put('history', trimmedHistory);
        }
      })();

      return new Response(readable, {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: 'Durable Object Internal Error', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
