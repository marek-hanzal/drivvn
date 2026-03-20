import { Effect } from "effect";
import { withColorSourceSelectFx } from "~/@color/db/withColorSourceSelectFx";

export namespace withColorSelectFx {
	export interface Props extends withColorSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withColorSelectFx>>;
}

export const withColorSelectFx = Effect.fn("withColorSelectFx")(function* ({
	sort,
}: withColorSelectFx.Props) {
	const sourceSelect = yield* withColorSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("c");
});
