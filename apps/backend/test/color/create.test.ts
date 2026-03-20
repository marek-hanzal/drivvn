import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("color/create", () => {
	it("creates a color exposed by the effect", async () => {
		const database = await testabase("color-create");

		await Effect.gen(function* () {
			const name = "Color Create Test";

			const create = yield* colorCreateFx({
				name,
			});

			expect(create).toMatchObject({
				id: expect.any(Number),
				name,
			});

			const collection = yield* colorCollectionFx({
				where: {
					name,
				},
			});

			expect(collection).toHaveLength(1);
			expect(collection[0]).toMatchObject(create);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
