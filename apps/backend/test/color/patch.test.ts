import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { colorPatchFx } from "~/@color/fx/colorPatchFx";
import { withTestKyselyFx } from "~test/support/testDatabase";

describe("color/patch", () => {
	it("patches a color exposed by the effect", () =>
		Effect.gen(function* () {
			const originalName = "Color Patch Before";
			const updatedName = "Color Patch After";

			const create = yield* colorCreateFx({
				name: originalName,
			});

			const patch = yield* colorPatchFx({
				query: {
					where: {
						id: String(create.id),
					},
				},
				patch: {
					name: updatedName,
				},
			});

			expect(patch).toMatchObject({
				id: create.id,
				name: updatedName,
			});

			const collection = yield* colorCollectionFx({
				where: {
					name: updatedName,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject(patch);
		}).pipe(withTestKyselyFx, Effect.runPromise));
});
