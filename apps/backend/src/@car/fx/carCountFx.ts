import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withCarQueryBuilderFx } from "~/@car/db/withCarQueryBuilderFx";
import { withCarSelectFx } from "~/@car/db/withCarSelectFx";
import type { CarCountQuerySchema } from "~/@car/schema/CarCountQuerySchema";

export namespace carCountFx {
	export interface Props extends CarCountQuerySchema.Type {
		//
	}
}

export const carCountFx = Effect.fn("carCountFx")(function* ({ filter, where }: carCountFx.Props) {
	return yield* withCountFx({
		selectFx: withCarSelectFx({}),
		filter,
		where,
		queryFx: withCarQueryBuilderFx,
	});
});

export type carCountFx = ReturnType<typeof carCountFx>;
