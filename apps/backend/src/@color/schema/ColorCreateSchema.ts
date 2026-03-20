import { z } from "@hono/zod-openapi";
import { ColorTableSchema } from "~/database/@table/ColorTableSchema";

export const ColorCreateSchema = z
	.looseObject({
		...ColorTableSchema.omit({
			id: true,
		}).shape,
	})
	.strip()
	.openapi("ColorCreate", {
		description: "Data for creating a new color",
	});

export type ColorCreateSchema = typeof ColorCreateSchema;

export namespace ColorCreateSchema {
	export type Type = z.infer<ColorCreateSchema>;
}
