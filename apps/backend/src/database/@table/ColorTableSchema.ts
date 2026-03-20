import z from "zod";

export const ColorTableSchema = z
	.looseObject({
		id: z.number(),
	})
	.strip();

export type ColorTableSchema = typeof ColorTableSchema;

export namespace ColorTableSchema {
	export type Type = z.infer<ColorTableSchema>;
}
