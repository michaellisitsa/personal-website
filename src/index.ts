import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/message':
				console.log('logging on the server');
				return new Response('Hello, World 2 !');
			case '/blog-message':
				console.log('Generating blog header');
				return new Response(`Blog for Date: ${Date.now()}`);
			case '/random':
				return new Response(crypto.randomUUID());
			case '/api/beverages':
				const { results } = await env.DB.prepare('SELECT * FROM Customers WHERE CompanyName = ?').bind('Bs Beverages').all();
				return Response.json(results);
			case '/api/users':
				const adapter = new PrismaD1(env.DB);
				const prisma = new PrismaClient({ adapter });

				const users = await prisma.user.findMany();
				const result = JSON.stringify(users);
				return new Response(result);
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
