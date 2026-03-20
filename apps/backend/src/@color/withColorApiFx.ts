import { Effect } from "effect";
import { withCollectionApiFx } from "~/@color/collection";
import { withCountApiFx } from "~/@color/count";
import { withCreateApiFx } from "~/@color/create";
import { withDeleteApiFx } from "~/@color/delete";
import { withFetchApiFx } from "~/@color/fetch";
import { withPatchApiFx } from "~/@color/patch";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withColorApiFx = Effect.fn("withColorApiFx")(function* () {
	const { root, colorHono } = yield* RoutesContextFx;

	root.use("/api/color/*", async (_, next) => {
		/**
		 * Here should be auth logic and providing user to hono's context, but... we've limited time for this magic.;
		 */
		return next();
	});

	yield* Effect.all([
		withCreateApiFx(),
		withPatchApiFx(),
		withFetchApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withDeleteApiFx(),
	]);

	root.route("/api/color", colorHono);
});
