import { Effect } from "effect";
import { colorFetchFx } from "~/@color/fx/colorFetchFx";
import type { ColorPatchSchema } from "~/@color/schema/ColorPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace colorPatchFx {
	export interface Props extends ColorPatchSchema.Type {}
}

export const colorPatchFx = Effect.fn("colorPatchFx")(function* ({
	patch,
	query,
}: colorPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const color = yield* colorFetchFx(query);

			yield* tryDbFx(async () =>
				kysely
					.updateTable("color")
					.set(patch)
					.where("id", "=", color.id)
					.executeTakeFirst(),
			);

			return yield* colorFetchFx({
				where: {
					id: String(color.id),
				},
			});
		}),
	);
});

export type colorPatchFx = ReturnType<typeof colorPatchFx>;
