import type { Generated } from "kysely";
import type { CarTableSchema } from "~/database/@table/CarTableSchema";
import type { ColorTableSchema } from "~/database/@table/ColorTableSchema";

type GenId<TInput> = Omit<TInput, "id"> & {
	id: Generated<number>;
};

export interface Database {
	color: GenId<ColorTableSchema.Type>;
	car: GenId<CarTableSchema.Type>;
}
