import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { carPatchFx } from "~/@car/fx/carPatchFx";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("car/patch", () => {
	it("patches a car exposed by the effect", async () => {
		const database = await testabase("car-patch");

		await Effect.gen(function* () {
			const create = yield* carCreateFx({
				color: "black",
				make: "Patch Make Before",
				model: "Patch Model Before",
				builtAt: new Date("2024-01-13T00:00:00.000Z"),
			});

			const colors = yield* colorCollectionFx({
				where: {
					name: "blue",
				},
			});

			const [blue] = colors;

			expect(blue).toBeDefined();

			if (!blue) {
				throw Error("We already handled this, but TS is crying about the type of `blue`");
			}

			const patch = yield* carPatchFx({
				query: {
					where: {
						id: String(create.id),
					},
				},
				patch: {
					colorId: blue.id,
					make: "Patch Make After",
					model: "Patch Model After",
					builtAt: new Date("2024-02-14T00:00:00.000Z"),
				},
			});

			expect(patch).toMatchObject({
				id: create.id,
				colorId: blue.id,
				make: "Patch Make After",
				model: "Patch Model After",
			});

			const collection = yield* carCollectionFx({
				where: {
					make: "Patch Make After",
					model: "Patch Model After",
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject(patch);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
