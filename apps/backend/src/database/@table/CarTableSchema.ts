import { DateTime } from "luxon";
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
		builtAt: z.coerce
			.date()
			.refine(
				(value) => {
					return (
						value >=
						DateTime.utc()
							.minus({
								years: 4,
							})
							.startOf("day")
							.toJSDate()
					);
				},
				{
					message: "Car build date can not be older than four years",
				},
			)
			.openapi({
				description: "Whe the car has been built",
				type: "string",
			}),
	})
	.strip()
	.openapi("Car", {
		description: "Represents a car",
	});

export type CarTableSchema = typeof CarTableSchema;

export namespace CarTableSchema {
	export type Type = z.infer<CarTableSchema>;
}
