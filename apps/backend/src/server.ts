import { DialectContextFx } from "@use-pico/common/database";
import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withCarApiFx } from "~/@car/withCarApiFx";
import { withCarHono } from "~/@car/withCarHono";
import { withColorApiFx } from "~/@color/withColorApiFx";
import { withColorHono } from "~/@color/withColorHono";
import { withPublicApiFx } from "~/@public/withPublicApiFx";
import { withPublicHono } from "~/@public/withPublicHono";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { database } from "~/database/kysely";
import { withHono } from "~/hono/withHono";
import { initMiddlewareFx } from "~/init/initMiddlewareFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerDatabaseSchema } from "~/schema/env/ServerDatabaseSchema";

const app = await Effect.gen(function* () {
	const { root } = yield* RoutesContextFx;

	root.onError((err, c) => {
		return c.json(
			{
				type: "error",
				message: err instanceof Error ? err.message : "Internal server error",
			},
			500,
			{
				"X-Error-Type": "Fallback Server Error",
			},
		);
	});

	const databaseConfig = ServerDatabaseSchema.parse(process.env);
	const kyselyContext = yield* database.pipe(
		Effect.provideService(
			DialectContextFx,
			new PostgresDialect({
				pool: new Pool({
					connectionString: databaseConfig.SERVER_DATABASE_URL,
				}),
			}),
		),
	);

	yield* initMiddlewareFx().pipe(withKyselyFx(kyselyContext));

	yield* Effect.all([
		withPublicApiFx(),
		/**
		 * Register all (root) routes in our app
		 */
		withCarApiFx(),
		withColorApiFx(),
	]).pipe(withKyselyFx(kyselyContext));

	return root;
}).pipe(
	Effect.provideService(RoutesContextFx, {
		root: withHono(),
		/**
		 * All the public stuff
		 */
		publicHono: withPublicHono(),
		/**
		 * Each root route may have different context requirements (thus types), so we've to separate them,
		 * also this gives us clear way where we're registering our endpoints without messing up with urls.
		 */
		carHono: withCarHono(),
		colorHono: withColorHono(),
	}),
	Effect.runPromise,
);

export default app;
