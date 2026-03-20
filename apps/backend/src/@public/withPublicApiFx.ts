import { Effect } from "effect";
import { withHealthApiFx } from "~/@public/health/withHealthApiFx";
import { withMigrationApiFx } from "~/@public/migration/withMigrationApiFx";
import { withOpenApiApiFx } from "~/@public/open-api/withOpenApiApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withPublicApiFx = Effect.fn("withPublicApiFx")(function* () {
	const { root, publicHono } = yield* RoutesContextFx;

	yield* Effect.all([
		withHealthApiFx(),
		withMigrationApiFx(),
		withOpenApiApiFx(),
	]);

	root.route("/api/public", publicHono);
});
