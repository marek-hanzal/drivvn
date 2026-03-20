import { Effect } from "effect";
import { colorFetchFx } from "~/@color/fx/colorFetchFx";
import type { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace colorDeleteFx {
	export interface Props extends ColorQuerySchema.Type {}
}

export const colorDeleteFx = Effect.fn("colorDeleteFx")(function* (query: colorDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const color = yield* colorFetchFx(query);

			yield* tryDbFx(async () =>
				kysely.deleteFrom("color").where("id", "=", color.id).execute()
			);

			return color;
		}),
	);
});

export type colorDeleteFx = ReturnType<typeof colorDeleteFx>;
