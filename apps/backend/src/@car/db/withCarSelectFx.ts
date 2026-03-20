import { Effect } from "effect";
import { sql } from "kysely";
import { withCarSourceSelectFx } from "~/@car/db/withCarSourceSelectFx";
import type { ColorSchema } from "~/@color/schema/ColorSchema";

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

	return sourceSelect
		.selectAll("c")
		.select((eb) =>
			sql<ColorSchema.Type>`json_object('id', ${eb.ref("clr.id")}, 'name', ${eb.ref("clr.name")})`.as(
				"color",
			),
		);
});
