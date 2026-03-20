import { z } from "@hono/zod-openapi";
import { ColorFilterSchema } from "~/@color/schema/ColorFilterSchema";
import { ColorSortSchema } from "~/@color/schema/ColorSortSchema";
import { ColorWhereSchema } from "~/@color/schema/ColorWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const ColorQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: ColorFilterSchema.optional(),
		where: ColorWhereSchema.optional(),
		sort: ColorSortSchema.array().optional(),
	})
	.strip()
	.openapi("ColorQuery", {
		description: "Query object for color access",
	});

export type ColorQuerySchema = typeof ColorQuerySchema;

export namespace ColorQuerySchema {
	export type Type = z.infer<typeof ColorQuerySchema>;
}
