import { z } from "@hono/zod-openapi";
import { ColorTableSchema } from "~/database/@table/ColorTableSchema";

export const ColorSchema = z
	.looseObject({
		...ColorTableSchema.shape,
	})
	.strip()
	.openapi("Color", {
		description: "Color data",
	});

export type ColorSchema = typeof ColorSchema;

export namespace ColorSchema {
	export type Type = z.infer<ColorSchema>;
}
