import { Effect } from "effect";
import { withCollectionApiFx } from "~/@car/collection";
import { withCountApiFx } from "~/@car/count";
import { withCreateApiFx } from "~/@car/create";
import { withDeleteApiFx } from "~/@car/delete";
import { withFetchApiFx } from "~/@car/fetch";
import { withPatchApiFx } from "~/@car/patch";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withCarApiFx = Effect.fn("withCarApiFx")(function* () {
	const { root, carHono } = yield* RoutesContextFx;

	root.use("/api/car/*", async (_, next) => {
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

	root.route("/api/car", carHono);
});
