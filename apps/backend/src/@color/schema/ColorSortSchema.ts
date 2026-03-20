import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const ColorSortSchema = z
	.object({
		field: z
			.enum([
				"id",
				"name",
			])
			.openapi("ColorSortField", {
				description: "Field of the color sort",
			}),
		order: OrderEnumSchema,
	})
	.openapi("ColorSort", {
		description: "Sort object for color collection",
	});

export type ColorSortSchema = typeof ColorSortSchema;

export namespace ColorSortSchema {
	export type Type = z.infer<ColorSortSchema>;
}
