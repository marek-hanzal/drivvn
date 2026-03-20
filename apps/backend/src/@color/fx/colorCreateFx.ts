import { Effect } from "effect";
import { colorFetchFx } from "~/@color/fx/colorFetchFx";
import type { ColorCreateSchema } from "~/@color/schema/ColorCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace colorCreateFx {
	export interface Props extends ColorCreateSchema.Type {
		//
	}
}

export const colorCreateFx = Effect.fn("colorCreateFx")(function* (data: colorCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const result = yield* tryDbFx(async () =>
				kysely.insertInto("color").values(data).returning("id").executeTakeFirstOrThrow(),
			);

			return yield* colorFetchFx({
				where: {
					id: String(result.id),
				},
			});
		}),
	);
});

export type colorCreateFx = ReturnType<typeof colorCreateFx>;
