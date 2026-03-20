import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("car/collection", () => {
	it("returns a filtered car collection", async () => {
		const database = await testabase("car-collection");

		await Effect.gen(function* () {
			const make = "Collection Make";
			const model = "Collection Model";
			const builtAt = new Date("2024-01-10T00:00:00.000Z");

			const create = yield* carCreateFx({
				color: "Black",
				make,
				model,
				builtAt,
			});

			const collection = yield* carCollectionFx({
				where: {
					make,
					model,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject({
				id: create.id,
				make,
				model,
				builtAt,
				color: {
					id: create.colorId,
					name: "Black",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
