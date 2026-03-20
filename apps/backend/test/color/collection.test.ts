import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { withTestKyselyFx } from "~test/support/testDatabase";

describe("color/collection", () => {
	it("returns a filtered color collection", () =>
		Effect.gen(function* () {
			const name = "Color Collection Test";

			yield* colorCreateFx({
				name,
			});

			const collection = yield* colorCollectionFx({
				where: {
					name,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject({
				id: expect.any(Number),
				name,
			});
		}).pipe(withTestKyselyFx, Effect.runPromise));
});
