import { Effect } from "effect";
import { DateTime } from "luxon";
import { carFetchFx } from "~/@car/fx/carFetchFx";
import type { CarPatchSchema } from "~/@car/schema/CarPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace carPatchFx {
	export interface Props extends CarPatchSchema.Type {}
}

export const carPatchFx = Effect.fn("carPatchFx")(function* ({ patch, query }: carPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const car = yield* carFetchFx(query);

			yield* tryDbFx(async () =>
				kysely
					.updateTable("car")
					.set({
						...patch,
						builtAt: patch.builtAt
							? (DateTime.fromISO(patch.builtAt).toSQLDate() ??
								DateTime.now().toSQL())
							: undefined,
					})
					.where("id", "=", car.id)
					.executeTakeFirst(),
			);

			return yield* carFetchFx({
				where: {
					id: String(car.id),
				},
			});
		}),
	);
});

export type carPatchFx = ReturnType<typeof carPatchFx>;
