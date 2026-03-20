import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const initMiddlewareFx = Effect.fn("initMiddleware")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	const withOpenCors = cors({
		origin: "*",
		allowHeaders: [
			"User-Agent",
			"Content-Type",
			"Authorization",
			"Mcp-Protocol-Version",
			"Last-Event-ID",
		],
		allowMethods: [
			"GET",
			"POST",
			"DELETE",
			"OPTIONS",
		],
		exposeHeaders: [
			"Content-Length",
			"X-Request-Id",
			"WWW-Authenticate",
			"Mcp-Session-Id",
			"Mcp-Protocol-Version",
		],
		maxAge: 600,
		credentials: false,
	});

	root.use(requestId());
	root.use(secureHeaders());
	root.use(
		/**
		 * We're fully open here
		 */
		withOpenCors,
		/**
		 * But this setup is (somewhat) safe for closed frontend/backend talks:
		 */
		// cors({
		// 	origin: [
		// 		viteConfig.VITE_WEB_ORIGIN,
		// 		viteConfig.VITE_APP_ORIGIN,
		// 	],
		// 	allowHeaders: [
		// 		"User-Agent",
		// 		"Content-Type",
		// 		"Authorization",
		// 	],
		// 	allowMethods: [
		// 		"GET",
		// 		"POST",
		// 		"PUT",
		// 		"DELETE",
		// 		"PATCH",
		// 		"OPTIONS",
		// 	],
		// 	exposeHeaders: [
		// 		"Content-Length",
		// 		"X-Request-Id",
		// 	],
		// 	maxAge: 600,
		// 	credentials: true,
		// }),
	);
	root.use(
		bodyLimit({
			// We don't need to accept large large body as file uploads will be done directly to the Storage
			maxSize: 1024 * 50,
		}),
	);
	root.use(async (c, next) => {
		c.set("kysely", kysely);

		// here iun general is user session resolution, but without throwing

		return next();
	});
});
