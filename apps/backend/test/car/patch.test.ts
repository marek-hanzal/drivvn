import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { carPatchFx } from "~/@car/fx/carPatchFx";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { withTestKyselyFx } from "~test/support/testDatabase";

describe("car/patch", () => {
	it("patches a car exposed by the effect", () =>
		Effect.gen(function* () {
			const create = yield* carCreateFx({
				color: "Black",
				make: "Patch Make Before",
				model: "Patch Model Before",
				builtAt: new Date("2024-01-13T00:00:00.000Z"),
			});

			const colors = yield* colorCollectionFx({
				where: {
					name: "Blue",
				},
			});

			const blue = colors[0]!;

			expect(blue).toBeDefined();

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
				builtAt: new Date("2024-02-14T00:00:00.000Z"),
				color: {
					id: blue.id,
					name: "Blue",
				},
			});

			const collection = yield* carCollectionFx({
				where: {
					make: "Patch Make After",
					model: "Patch Model After",
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject(patch);
		}).pipe(withTestKyselyFx, Effect.runPromise));
});
