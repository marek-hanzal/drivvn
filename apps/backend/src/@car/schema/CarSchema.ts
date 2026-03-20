import { z } from "@hono/zod-openapi";
import { CarTableSchema } from "~/database/@table/CarTableSchema";

export const CarSchema = z
	.looseObject({
		...CarTableSchema.shape,
	})
	.strip()
	.openapi("Car", {
		description: "Car data",
	});

export type CarSchema = typeof CarSchema;

export namespace CarSchema {
	export type Type = z.infer<CarSchema>;
}
