import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { carDeleteFx } from "~/@car/fx/carDeleteFx";
import { withTestKyselyFx } from "~test/support/testDatabase";

describe("car/delete", () => {
	it("deletes a car exposed by the effect", () =>
		Effect.gen(function* () {
			const make = "Delete Make";
			const model = "Delete Model";
			const builtAt = "2024-01-12T00:00:00.000Z";

			const create = yield* carCreateFx({
				color: "Black",
				make,
				model,
				builtAt,
			});

			const deleted = yield* carDeleteFx({
				where: {
					id: String(create.id),
				},
			});

			expect(deleted).toMatchObject(create);

			const collection = yield* carCollectionFx({
				where: {
					make,
					model,
				},
			});

			expect(collection).toHaveLength(0);
		}).pipe(withTestKyselyFx, Effect.runPromise));
});
