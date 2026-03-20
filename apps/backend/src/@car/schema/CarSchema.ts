import { z } from "@hono/zod-openapi";
import { ColorSchema } from "~/@color/schema/ColorSchema";
import { CarTableSchema } from "~/database/@table/CarTableSchema";

export const CarSchema = z
	.looseObject({
		...CarTableSchema.shape,
		color: z.preprocess((value) => {
			if (typeof value !== "string") {
				return value;
			}

			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		}, ColorSchema),
	})
	.strip()
	.openapi("Car", {
		description: "Car data",
	});

export type CarSchema = typeof CarSchema;

export namespace CarSchema {
	export type Type = z.infer<CarSchema>;
}
