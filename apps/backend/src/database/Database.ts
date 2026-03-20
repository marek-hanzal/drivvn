import type { CarTableSchema } from "~/database/@table/CarTableSchema";
import type { ColorTableSchema } from "~/database/@table/ColorTableSchema";

export interface Database {
	color: ColorTableSchema.Type;
	car: CarTableSchema.Type;
}
