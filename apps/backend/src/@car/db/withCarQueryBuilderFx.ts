import { Effect } from "effect";
import type { withCarSourceSelectFx } from "~/@car/db/withCarSourceSelectFx";
import type { CarFilterSchema } from "~/@car/schema/CarFilterSchema";

export namespace withCarQueryBuilderFx {
	export interface Props<
		TSelect extends withCarSourceSelectFx.Select = withCarSourceSelectFx.Select,
	> {
		select: TSelect;
		where?: CarFilterSchema.Type;
	}

	export type Callback = <TSelect extends withCarSourceSelectFx.Select>(
		props: Props<TSelect>,
	) => TSelect;
}

export const withCarQueryBuilderFx = Effect.fn("withCarQueryBuilderFx")(function* <
	TSelect extends withCarSourceSelectFx.Select,
>({ select, where }: withCarQueryBuilderFx.Props<TSelect>) {
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

	if (where.colorId) {
		query = query.where("c.colorId", "=", Number(where.colorId)) as TSelect;
	}

	if (where.make) {
		query = query.where("c.make", "=", where.make) as TSelect;
	}

	if (where.model) {
		query = query.where("c.model", "=", where.model) as TSelect;
	}

	return yield* Effect.succeed(query);
});
