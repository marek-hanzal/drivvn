import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withCarQueryBuilderFx } from "~/@car/db/withCarQueryBuilderFx";
import { withCarSelectFx } from "~/@car/db/withCarSelectFx";
import type { CarQuerySchema } from "~/@car/schema/CarQuerySchema";

export namespace carFetchFx {
	export interface Props extends CarQuerySchema.Type {
		//
	}
}

export const carFetchFx = Effect.fn("carFetchFx")(function* ({
	filter,
	where,
	sort,
}: carFetchFx.Props) {
	return yield* withFetchFx({
		resource: "car",
		selectFx: withCarSelectFx({
			sort,
		}),
		queryFx: withCarQueryBuilderFx,
		filter,
		where,
	});
});

export type carFetchFx = ReturnType<typeof carFetchFx>;
