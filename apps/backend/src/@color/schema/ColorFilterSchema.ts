import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const ColorFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		name: z.string().min(1).optional().openapi({
			description: "Exact color name",
		}),
	})
	.openapi("ColorFilter", {
		description: "Filter object for color collection",
	});

export type ColorFilterSchema = typeof ColorFilterSchema;

export namespace ColorFilterSchema {
	export type Type = z.infer<ColorFilterSchema>;
}
