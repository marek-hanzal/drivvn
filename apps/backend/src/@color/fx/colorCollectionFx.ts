import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withColorCollectionSelectFx } from "~/@color/db/withColorCollectionSelectFx";
import { withColorQueryBuilderFx } from "~/@color/db/withColorQueryBuilderFx";
import type { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";

export namespace colorCollectionFx {
	export interface Props extends ColorQuerySchema.Type {
		//
	}
}

export const colorCollectionFx = Effect.fn("colorCollectionFx")(function* ({
	filter,
	where,
	cursor,
	sort,
}: colorCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withColorCollectionSelectFx({
			sort,
		}),
		queryFx: withColorQueryBuilderFx,
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
	});
});

export type colorCollectionFx = ReturnType<typeof colorCollectionFx>;
