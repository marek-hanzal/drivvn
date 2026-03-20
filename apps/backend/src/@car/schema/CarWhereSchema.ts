import { z } from "@hono/zod-openapi";
import { CarFilterSchema } from "~/@car/schema/CarFilterSchema";

export const CarWhereSchema = z
	.object({
		...CarFilterSchema.shape,
	})
	.openapi("CarWhere", {
		description: "App-based filters",
	});

export type CarWhereSchema = typeof CarWhereSchema;

export namespace CarWhereSchema {
	export type Type = z.infer<CarWhereSchema>;
}
