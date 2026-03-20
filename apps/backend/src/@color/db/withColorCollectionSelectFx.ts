import { Effect } from "effect";
import { withColorSelectFx } from "~/@color/db/withColorSelectFx";
import type { withColorSourceSelectFx } from "~/@color/db/withColorSourceSelectFx";

export namespace withColorCollectionSelectFx {
	export interface Props extends withColorSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withColorCollectionSelectFx>>;
}

export const withColorCollectionSelectFx = Effect.fn("withColorCollectionSelectFx")(function* ({
	sort,
}: withColorCollectionSelectFx.Props) {
	return yield* withColorSelectFx({
		sort,
	});
});
