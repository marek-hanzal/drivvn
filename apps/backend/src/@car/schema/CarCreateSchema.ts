import { z } from "@hono/zod-openapi";
import { CarTableSchema } from "~/database/@table/CarTableSchema";

export const CarCreateSchema = z
	.looseObject({
		...CarTableSchema.omit({
			id: true,
		}).shape,
	})
	.strip()
	.openapi("CarCreate", {
		description: "Data for creating a new car",
	});

export type CarCreateSchema = typeof CarCreateSchema;

export namespace CarCreateSchema {
	export type Type = z.infer<CarCreateSchema>;
}
