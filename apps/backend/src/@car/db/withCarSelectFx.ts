import { Effect } from "effect";
import { withCarSourceSelectFx } from "~/@car/db/withCarSourceSelectFx";

export namespace withCarSelectFx {
	export interface Props extends withCarSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCarSelectFx>>;
}

export const withCarSelectFx = Effect.fn("withCarSelectFx")(function* ({
	sort,
}: withCarSelectFx.Props) {
	const sourceSelect = yield* withCarSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("c");
});
