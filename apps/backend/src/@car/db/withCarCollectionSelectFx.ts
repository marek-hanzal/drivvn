import { Effect } from "effect";
import { withCarSelectFx } from "~/@car/db/withCarSelectFx";
import type { withCarSourceSelectFx } from "~/@car/db/withCarSourceSelectFx";

export namespace withCarCollectionSelectFx {
	export interface Props extends withCarSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCarCollectionSelectFx>>;
}

export const withCarCollectionSelectFx = Effect.fn("withCarCollectionSelectFx")(function* ({
	sort,
}: withCarCollectionSelectFx.Props) {
	return yield* withCarSelectFx({
		sort,
	});
});
