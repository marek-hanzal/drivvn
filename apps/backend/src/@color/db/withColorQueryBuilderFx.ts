import { Effect } from "effect";
import type { withColorSourceSelectFx } from "~/@color/db/withColorSourceSelectFx";
import type { ColorFilterSchema } from "~/@color/schema/ColorFilterSchema";

export namespace withColorQueryBuilderFx {
	export interface Props<
		TSelect extends withColorSourceSelectFx.Select = withColorSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: ColorFilterSchema.Type;
	}

	export type Callback = <TSelect extends withColorSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withColorQueryBuilderFx = Effect.fn("withColorQueryBuilderFx")(function* <
	TSelect extends withColorSourceSelectFx.Select,
>({ select, where }: withColorQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("c.id", "=", Number(where.id)) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where(
			"c.id",
			"in",
			where.idIn.map((id) => Number(id)),
		) as TSelect;
	}

	if (where.name) {
		query = query.where("c.name", "=", where.name) as TSelect;
	}

	return yield* Effect.succeed(query);
});
