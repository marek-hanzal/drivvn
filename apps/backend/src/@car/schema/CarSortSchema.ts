import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const CarSortSchema = z
	.object({
		field: z
			.enum([
				"id",
				"colorId",
				"make",
				"model",
				"builtAt",
			])
			.openapi("CarSortField", {
				description: "Field of the car sort",
			}),
		order: OrderEnumSchema,
	})
	.openapi("CarSort", {
		description: "Sort object for car collection",
	});

export type CarSortSchema = typeof CarSortSchema;

export namespace CarSortSchema {
	export type Type = z.infer<CarSortSchema>;
}
