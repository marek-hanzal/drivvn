import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { colorDeleteFx } from "~/@color/fx/colorDeleteFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("color/delete", () => {
	it("deletes a color exposed by the effect", async () => {
		const database = await testabase("color-delete");

		await Effect.gen(function* () {
			const name = "Color Delete Test";

			const create = yield* colorCreateFx({
				name,
			});

			const deleted = yield* colorDeleteFx({
				where: {
					id: String(create.id),
				},
			});

			expect(deleted).toMatchObject(create);

			const collection = yield* colorCollectionFx({
				where: {
					name,
				},
			});

			expect(collection).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
