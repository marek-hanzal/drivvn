import { z } from "@hono/zod-openapi";
import { CarQuerySchema } from "~/@car/schema/CarQuerySchema";
import { CarTableSchema } from "~/database/@table/CarTableSchema";

export const CarPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...CarTableSchema.omit({
					id: true,
				}).shape,
			})
			.partial()
			.strip()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: CarQuerySchema,
	})
	.strip()
	.openapi("CarPatch", {
		description: "Data for updating an existing car",
	});

export type CarPatchSchema = typeof CarPatchSchema;

export namespace CarPatchSchema {
	export type Type = z.infer<CarPatchSchema>;
}
