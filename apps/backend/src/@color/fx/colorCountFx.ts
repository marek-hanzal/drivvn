import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withColorQueryBuilderFx } from "~/@color/db/withColorQueryBuilderFx";
import { withColorSelectFx } from "~/@color/db/withColorSelectFx";
import type { ColorCountQuerySchema } from "~/@color/schema/ColorCountQuerySchema";

export namespace colorCountFx {
	export interface Props extends ColorCountQuerySchema.Type {
		//
	}
}

export const colorCountFx = Effect.fn("colorCountFx")(function* ({
	filter,
	where,
}: colorCountFx.Props) {
	return yield* withCountFx({
		selectFx: withColorSelectFx({}),
		filter,
		where,
		queryFx: withColorQueryBuilderFx,
	});
});

export type colorCountFx = ReturnType<typeof colorCountFx>;
