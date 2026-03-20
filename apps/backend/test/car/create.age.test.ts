import { Effect } from "effect";
import { DateTime } from "luxon";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { testabase } from "~test/testabase";
import { withRuntimeFx } from "~test/withRuntimeFx";

describe("car/create age", () => {
	it("creates a car with a build date exactly four years old", async () => {
		const database = await testabase("car-create-age-boundary");

		await Effect.gen(function* () {
			const builtAt = DateTime.utc()
				.minus({
					years: 4,
				})
				.startOf("day")
				.toJSDate();

			const result = yield* carCreateFx({
				color: "black",
				make: "Boundary Make",
				model: "Boundary Model",
				builtAt,
			});

			expect(result).toMatchObject({
				id: expect.any(Number),
				make: "Boundary Make",
				model: "Boundary Model",
				builtAt,
				color: {
					name: "black",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("rejects a car with a build date older than four years", async () => {
		const database = await testabase("car-create-age-old");

		await Effect.gen(function* () {
			const builtAt = DateTime.utc()
				.minus({
					years: 4,
					days: 1,
				})
				.startOf("day")
				.toJSDate();

			const result = yield* Effect.either(
				carCreateFx({
					color: "black",
					make: "Old Make",
					model: "Old Model",
					builtAt,
				}),
			);

			expect(result._tag).toBe("Left");

			if (result._tag !== "Left") {
				throw new Error("Expected carCreateFx to fail");
			}

			const error = result.left;

			expect(error).toMatchObject({
				_tag: "InvalidRequestErrorFx",
			});

			if (error._tag !== "InvalidRequestErrorFx") {
				throw new Error("Expected InvalidRequestErrorFx");
			}

			expect(error.message).toBe("Car build date can not be older than four years");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
