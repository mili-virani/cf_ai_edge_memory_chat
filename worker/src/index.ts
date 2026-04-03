import { Env, ChatRequest } from './types';
export { ChatSession } from './ChatSession';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Main /chat endpoint
		if (request.method === 'POST' && url.pathname === '/chat') {
			try {
				// Clone the request because we need to read the JSON body for the API routing,
				// but we will also pass the original request to the DO stub.
				const body = await request.clone().json<ChatRequest>().catch(() => null);

				if (!body || !body.message) {
					return new Response(JSON.stringify({ error: 'Message input is required' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					});
				}

				const sessionId = body.sessionId || 'default-session';

				// Get the Durable Object stub
				const id = env.CHAT_SESSION.idFromName(sessionId);
				const stub = env.CHAT_SESSION.get(id);

				// Forward the request to the Durable Object
				const doResponse = await stub.fetch(request);

				// Create a new response to append CORS headers
				const finalResponse = new Response(doResponse.body, doResponse);
				finalResponse.headers.set('Access-Control-Allow-Origin', '*');
				return finalResponse;
			} catch (error: any) {
				return new Response(
					JSON.stringify({ error: 'Internal Server Error', details: error.message }),
					{
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}
		}

		// Fallback for undefined routes
		return new Response(JSON.stringify({ error: 'Not Found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		});
	},
} satisfies ExportedHandler<Env>;
