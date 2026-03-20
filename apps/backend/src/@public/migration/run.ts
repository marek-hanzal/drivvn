import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const MigrationSchema = z
	.looseObject({
		migrationName: z.string().openapi({
			description: "Migration name run",
		}),
		direction: z
			.enum([
				"Up",
				"Down",
			])
			.openapi("MigrationDirection", {
				description: "Migration direction",
			}),
		status: z
			.enum([
				"Success",
				"Error",
				"NotExecuted",
			])
			.openapi("MigrationStatus", {
				description: "Migration status",
			}),
	})
	.strip()
	.openapi("Migration", {
		description: "Migration result schema",
	});

/**
 * So _this_ endpoint should **not** be public, but for simplicity, it's here.
 *
 * Basic reason is: running migrations should in general be fast (so prod is not blocked), so this is enough (also serverless envs.
 * does not have access to cli).
 *
 * If longer task is needed to run, cli -> prod database is an option.
 */
export const withMigrationRunApiFx = Effect.fn("withMigrationRunApiFx")(function* () {
	const { publicHono } = yield* RoutesContextFx;

	publicHono.openapi(
		createRoute({
			method: "post",
			path: "/migration/run",
			description: "This route directly executes the migrations",
			operationId: "apiMigrationRun",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(MigrationSchema),
						},
					},
					description: "Executes app migrations",
				},
			},
			security: [],
			tags: [
				"Misc",
			],
		}),
		async (c) => {
			return c.json((await c.get("kysely").migrate()) ?? [], 200);
		},
	);
});
