import { ColorMigration } from "~/database/migrations/0001-color";
import { CarMigration } from "~/database/migrations/0002-car";

export const migrations = {
	"0001-color": ColorMigration,
	"0002-car": CarMigration,
} as const;
