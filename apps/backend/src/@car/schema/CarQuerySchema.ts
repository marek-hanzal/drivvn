import { z } from "@hono/zod-openapi";
import { CarFilterSchema } from "~/@car/schema/CarFilterSchema";
import { CarSortSchema } from "~/@car/schema/CarSortSchema";
import { CarWhereSchema } from "~/@car/schema/CarWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const CarQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: CarFilterSchema.optional(),
		where: CarWhereSchema.optional(),
		sort: CarSortSchema.array().optional(),
	})
	.strip()
	.openapi("CarQuery", {
		description: "Query object for car access",
	});

export type CarQuerySchema = typeof CarQuerySchema;

export namespace CarQuerySchema {
	export type Type = z.infer<typeof CarQuerySchema>;
}
