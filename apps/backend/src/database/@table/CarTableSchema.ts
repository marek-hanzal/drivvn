import z from "zod";

export const CarTableSchema = z
	.looseObject({
		id: z.number(),
		colorId: z.number().openapi({
			description: "Reference to the color",
		}),
		make: z.string().min(1).openapi({
			description: "Who made the car",
		}),
		model: z.string().min(1).openapi({
			description: "How cool the car is in the make's roaster",
		}),
	})
	.strip();

export type CarTableSchema = typeof CarTableSchema;

export namespace CarTableSchema {
	export type Type = z.infer<CarTableSchema>;
}
