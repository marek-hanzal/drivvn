import type { Migration } from "kysely";

const DEFAULT_COLORS = [
	"Black",
	"White",
	"Gray",
	"Silver",
	"Red",
	"Blue",
	"Green",
	"Yellow",
	"Orange",
	"Brown",
	"Beige",
	"Purple",
].map((name) => ({
	name,
}));

export const ColorMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("color")
			.addColumn("id", "integer", (column) => column.primaryKey().autoIncrement().notNull())
			.addColumn("name", "text", (column) => column.notNull())
			.execute();

		await db.schema.createIndex("color_name_uq").on("color").column("name").unique().execute();

		await db.insertInto("color").values(DEFAULT_COLORS).execute();
	},
};
