import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { withTestKyselyFx } from "~test/support/testDatabase";

describe("car/create", () => {
	it("creates a car exposed by the effect", () =>
		Effect.gen(function* () {
			const make = "Create Make";
			const model = "Create Model";
			const builtAt = new Date("2024-01-11T00:00:00.000Z");

			const create = yield* carCreateFx({
				color: "Black",
				make,
				model,
				builtAt,
			});

			expect(create).toMatchObject({
				id: expect.any(Number),
				colorId: expect.any(Number),
				make,
				model,
				builtAt,
				color: {
					id: create.colorId,
					name: "Black",
				},
			});

			const collection = yield* carCollectionFx({
				where: {
					make,
					model,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject(create);
		}).pipe(withTestKyselyFx, Effect.runPromise));
});
