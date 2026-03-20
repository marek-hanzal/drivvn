import { z } from "@hono/zod-openapi";
import { ColorFilterSchema } from "~/@color/schema/ColorFilterSchema";

export const ColorWhereSchema = z
	.object({
		...ColorFilterSchema.shape,
	})
	.openapi("ColorWhere", {
		description: "App-based filters",
	});

export type ColorWhereSchema = typeof ColorWhereSchema;

export namespace ColorWhereSchema {
	export type Type = z.infer<ColorWhereSchema>;
}
