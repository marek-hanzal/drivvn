import { Effect } from "effect";
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
		//
	]);

	root.route("/api/car", carHono);
});
