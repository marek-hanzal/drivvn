import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ColorSortSchema } from "~/@color/schema/ColorSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withColorSourceSelectFx {
	export interface Props {
		sort?: ColorSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withColorSourceSelectFx>>;
}

export const withColorSourceSelectFx = Effect.fn("withColorSourceSelectFx")(function* ({
	sort,
}: withColorSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("color as c");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("c.id", item.order))
			.with("name", () => query.orderBy("c.name", item.order))
			.exhaustive();
	}

	return query;
});
