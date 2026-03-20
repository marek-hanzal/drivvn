import { Effect } from "effect";
import { match } from "ts-pattern";
import type { CarSortSchema } from "~/@car/schema/CarSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withCarSourceSelectFx {
	export interface Props {
		sort?: CarSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCarSourceSelectFx>>;
}

export const withCarSourceSelectFx = Effect.fn("withCarSourceSelectFx")(function* ({
	sort,
}: withCarSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("car as c").innerJoin("color as clr", "clr.id", "c.colorId");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("c.id", item.order))
			.with("colorId", () => query.orderBy("c.colorId", item.order))
			.with("make", () => query.orderBy("c.make", item.order))
			.with("model", () => query.orderBy("c.model", item.order))
			.with("builtAt", () => query.orderBy("c.builtAt", item.order))
			.exhaustive();
	}

	return query;
});
