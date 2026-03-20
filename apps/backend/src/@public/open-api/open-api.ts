import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const docsUrl = "/v3/api-docs";

const tagsRegistry: Record<
	string,
	{
		name: string;
		description: string;
	}
> = {
	//
} as const;

const extractTagsFromOpenApiDocument = (
	doc: ReturnType<OpenAPIHono["getOpenAPI31Document"]>,
): Array<{
	name: string;
	description: string;
}> => {
	const usedTags = new Set<string>();

	if (doc.paths) {
		for (const pathItem of Object.values(doc.paths)) {
			if (!pathItem) {
				continue;
			}
			const operations = [
				pathItem.get,
				pathItem.post,
				pathItem.put,
				pathItem.patch,
				pathItem.delete,
				pathItem.head,
				pathItem.options,
			].filter(Boolean);

			for (const operation of operations) {
				if (operation?.tags) {
					for (const tag of operation.tags) {
						usedTags.add(tag);
					}
				}
			}
		}
	}

	return Array.from(usedTags)
		.map((tagName) => tagsRegistry[tagName])
		.filter(
			(
				tag,
			): tag is {
				name: string;
				description: string;
			} => tag !== undefined,
		)
		.sort((a, b) => a.name.localeCompare(b.name));
};

export const withOpenApiEndpointFx = Effect.fn("withOpenApiEndpointFx")(function* () {
	const { root, publicHono, carHono } = yield* RoutesContextFx;

	const viteConfig = ServerViteSchema.parse(process.env);
	const apiBase = viteConfig.VITE_SERVER_API.replace(/\/$/, "");

	root.get(
		"/",
		Scalar({
			title: "Drivvn API server",
			pageTitle: "Drivvn API server",
			sources: [
				{
					url: `${docsUrl}/public`,
					title: "Public",
				},
				{
					url: `${docsUrl}/car`,
					title: "Car",
				},
			],
		}),
	);

	/**
	 * This is unused in this setup, but it's used to provide docs for auth schema used in this API.
	 */
	const cookieAuth = {
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "better-auth.session_token",
					description: "Cookie-based authentication using better-auth session token",
				},
			},
		},
		security: [
			{
				cookieAuth: [],
			},
		],
	};

	const docWithMount = (
		mount: string,
		app: OpenAPIHono<any>,
		opts: Parameters<OpenAPIHono["getOpenAPI31Document"]>[0],
	) => {
		const tmp = new OpenAPIHono();
		tmp.route(mount, app);
		const docWithoutTags = tmp.getOpenAPI31Document({
			...opts,
			tags: undefined,
			servers: [
				{
					url: apiBase,
				},
			],
		});
		const extractedTags = extractTagsFromOpenApiDocument(docWithoutTags);
		return {
			...docWithoutTags,
			tags: extractedTags,
		};
	};

	let cache: null | {
		public: unknown;
		car: unknown;
	} = null;

	const docs = () => {
		if (cache) {
			return cache;
		}

		cache = {
			public: docWithMount("/api/public", publicHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Public API stuff",
					description: "Free for all",
				},
				security: [],
			}),
			car: docWithMount("/api/car", carHono, {
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Car API",
					description: "Wanna some car? Come here!",
				},
				security: [],
			}),
		};

		return cache;
	};

	root.get(`${docsUrl}/public`, (c) => c.json(docs().public));
	root.get(`${docsUrl}/car`, (c) => c.json(docs().car));

	root.doc31(docsUrl, {
		openapi: "3.1.0",
		info: {
			version: "0.5.0",
			title: "Drivvn API server",
		},
		servers: [
			{
				url: apiBase,
			},
		],
		...cookieAuth,
	});
});
