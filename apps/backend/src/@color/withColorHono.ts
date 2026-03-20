import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withColorHono = () => {
	return new OpenAPIHono<{
		Variables: {
			kysely: KyselyContext;
		};
	}>();
};

export type withColorHono = ReturnType<typeof withColorHono>;
