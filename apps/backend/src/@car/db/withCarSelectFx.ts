import { Effect } from "effect";
import { jsonBuildObject } from "kysely/helpers/postgres";
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

	return sourceSelect.selectAll("c").select((eb) =>
		jsonBuildObject({
			id: eb.ref("clr.id"),
			name: eb.ref("clr.name"),
		}).as("color"),
	);
});
