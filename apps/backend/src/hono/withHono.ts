import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			kysely: KyselyContext;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
