import { z } from "@hono/zod-openapi";
import { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";

export const ColorCountQuerySchema = z
	.looseObject({
		...ColorQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("ColorCountQuery", {
		description: "Query object for color count",
	});

export type ColorCountQuerySchema = typeof ColorCountQuerySchema;

export namespace ColorCountQuerySchema {
	export type Type = z.infer<ColorCountQuerySchema>;
}
