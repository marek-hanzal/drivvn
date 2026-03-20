import { Effect } from "effect";
import { withCollectionApiFx } from "~/@car/collection";
import { withCreateApiFx } from "~/@car/create";
import { withDeleteApiFx } from "~/@car/delete";
import { withFetchApiFx } from "~/@car/fetch";
import { withPatchApiFx } from "~/@car/patch";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withCarApiFx = Effect.fn("withCarApiFx")(function* () {
	const { root, carHono } = yield* RoutesContextFx;

	yield* Effect.all([
		withCreateApiFx(),
		withPatchApiFx(),
		withFetchApiFx(),
		withCollectionApiFx(),
		withDeleteApiFx(),
	]);

	root.route("/", carHono);
});
