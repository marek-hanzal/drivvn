import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withCarCollectionSelectFx } from "~/@car/db/withCarCollectionSelectFx";
import { withCarQueryBuilderFx } from "~/@car/db/withCarQueryBuilderFx";
import type { CarQuerySchema } from "~/@car/schema/CarQuerySchema";

export namespace carCollectionFx {
	export interface Props extends CarQuerySchema.Type {
		//
	}
}

export const carCollectionFx = Effect.fn("carCollectionFx")(function* ({
	filter,
	where,
	cursor,
	sort,
}: carCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withCarCollectionSelectFx({
			sort,
		}),
		queryFx: withCarQueryBuilderFx,
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
	});
});

export type carCollectionFx = ReturnType<typeof carCollectionFx>;
