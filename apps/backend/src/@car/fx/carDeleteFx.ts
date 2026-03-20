import { Effect } from "effect";
import { carFetchFx } from "~/@car/fx/carFetchFx";
import type { CarQuerySchema } from "~/@car/schema/CarQuerySchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace carDeleteFx {
	export interface Props extends CarQuerySchema.Type {}
}

export const carDeleteFx = Effect.fn("carDeleteFx")(function* (query: carDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const car = yield* carFetchFx(query);

			yield* tryDbFx(async () => kysely.deleteFrom("car").where("id", "=", car.id).execute());

			return car;
		}),
	);
});

export type carDeleteFx = ReturnType<typeof carDeleteFx>;
