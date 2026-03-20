import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withPublicHono = () => {
	return new OpenAPIHono<{
		Variables: {
			kysely: KyselyContext;
		};
	}>();
};

export type withPublicHono = ReturnType<typeof withPublicHono>;
