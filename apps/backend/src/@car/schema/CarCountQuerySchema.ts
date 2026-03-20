import { z } from "@hono/zod-openapi";
import { CarQuerySchema } from "~/@car/schema/CarQuerySchema";

export const CarCountQuerySchema = z
	.looseObject({
		...CarQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("CarCountQuery", {
		description: "Query object for car count",
	});

export type CarCountQuerySchema = typeof CarCountQuerySchema;

export namespace CarCountQuerySchema {
	export type Type = z.infer<CarCountQuerySchema>;
}
