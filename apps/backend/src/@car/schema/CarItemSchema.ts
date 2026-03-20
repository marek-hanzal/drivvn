import { z } from "@hono/zod-openapi";
import { CarSchema } from "~/@car/schema/CarSchema";

export const CarItemSchema = z
	.looseObject({
		...CarSchema.shape,
	})
	.strip()
	.openapi("CarItem", {
		description: "Car collection item",
	});

export type CarItemSchema = typeof CarItemSchema;

export namespace CarItemSchema {
	export type Type = z.infer<CarItemSchema>;
}
