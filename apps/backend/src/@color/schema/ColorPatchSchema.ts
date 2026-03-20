import { z } from "@hono/zod-openapi";
import { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";
import { ColorTableSchema } from "~/database/@table/ColorTableSchema";

export const ColorPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...ColorTableSchema.omit({
					id: true,
				}).shape,
			})
			.partial()
			.strip()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: ColorQuerySchema,
	})
	.strip()
	.openapi("ColorPatch", {
		description: "Data for updating an existing color",
	});

export type ColorPatchSchema = typeof ColorPatchSchema;

export namespace ColorPatchSchema {
	export type Type = z.infer<ColorPatchSchema>;
}
