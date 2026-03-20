import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const CarFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		colorId: z.string().optional().openapi({
			description: "Exact color id",
		}),
		make: z.string().min(1).optional().openapi({
			description: "Exact car make",
		}),
		model: z.string().min(1).optional().openapi({
			description: "Exact car model",
		}),
	})
	.openapi("CarFilter", {
		description: "Filter object for car collection",
	});

export type CarFilterSchema = typeof CarFilterSchema;

export namespace CarFilterSchema {
	export type Type = z.infer<CarFilterSchema>;
}
