import { z } from "@hono/zod-openapi";
import { ColorSchema } from "~/@color/schema/ColorSchema";

export const ColorItemSchema = z
	.looseObject({
		...ColorSchema.shape,
	})
	.strip()
	.openapi("ColorItem", {
		description: "Color collection item",
	});

export type ColorItemSchema = typeof ColorItemSchema;

export namespace ColorItemSchema {
	export type Type = z.infer<ColorItemSchema>;
}
