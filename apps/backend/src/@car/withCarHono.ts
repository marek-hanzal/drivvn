import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withCarHono = () => {
	return new OpenAPIHono<{
		Variables: {
			kysely: KyselyContext;
		};
	}>();
};

export type withCarHono = ReturnType<typeof withCarHono>;
