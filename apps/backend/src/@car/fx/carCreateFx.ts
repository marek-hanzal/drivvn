import { DateTime } from "luxon";
import { Effect } from "effect";
import { carFetchFx } from "~/@car/fx/carFetchFx";
import type { CarCreateSchema } from "~/@car/schema/CarCreateSchema";
import { colorFetchFx } from "~/@color/fx/colorFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/error/InvalidRequestErrorFx";

export namespace carCreateFx {
	export interface Props extends CarCreateSchema.Type {
		//
	}
}

export const carCreateFx = Effect.fn("carCreateFx")(function* ({
	color,
	...data
}: carCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			if (
				data.builtAt <
				DateTime.utc()
					.minus({
						years: 4,
					})
					.startOf("day")
					.toJSDate()
			) {
				return yield* new InvalidRequestErrorFx({
					message: "Car build date can not be older than four years",
				});
			}

			const { kysely } = yield* KyselyContextFx;
			const targetColor = yield* colorFetchFx({
				where: {
					name: color,
				},
			});

			const result = yield* tryDbFx(async () =>
				kysely
					.insertInto("car")
					.values({
						...data,
						colorId: targetColor.id,
					})
					.returning("id")
					.executeTakeFirstOrThrow(),
			);

			return yield* carFetchFx({
				where: {
					id: String(result.id),
				},
			});
		}),
	);
});

export type carCreateFx = ReturnType<typeof carCreateFx>;
