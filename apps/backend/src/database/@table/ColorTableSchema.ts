import z from "zod";

export const ColorTableSchema = z
	.looseObject({
		id: z.number(),
		name: z.string().min(1).openapi({
			description: "Name of the color",
		}),
	})
	.strip()
	.openapi("Color", {
		description: "Just a color.",
	});

export type ColorTableSchema = typeof ColorTableSchema;

export namespace ColorTableSchema {
	export type Type = z.infer<ColorTableSchema>;
}
