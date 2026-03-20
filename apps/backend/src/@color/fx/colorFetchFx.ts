import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withColorQueryBuilderFx } from "~/@color/db/withColorQueryBuilderFx";
import { withColorSelectFx } from "~/@color/db/withColorSelectFx";
import type { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";

export namespace colorFetchFx {
	export interface Props extends ColorQuerySchema.Type {
		//
	}
}

export const colorFetchFx = Effect.fn("colorFetchFx")(function* ({
	filter,
	where,
	sort,
}: colorFetchFx.Props) {
	return yield* withFetchFx({
		resource: "color",
		selectFx: withColorSelectFx({
			sort,
		}),
		queryFx: withColorQueryBuilderFx,
		filter,
		where,
	});
});

export type colorFetchFx = ReturnType<typeof colorFetchFx>;
