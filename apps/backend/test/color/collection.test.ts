import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("color/collection", () => {
	it("returns a filtered color collection", async () => {
		const database = await testabase("color-collection");

		await Effect.gen(function* () {
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
