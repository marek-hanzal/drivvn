import type { Migration } from "kysely";

export const ColorMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("color")
			.addColumn("id", "integer", (column) =>
				column.primaryKey().autoIncrement().notNull(),
			)
			.addColumn("name", "text", (column) => column.notNull())
			.execute();

		await db.schema
			.createIndex("color_name_uq")
			.on("color")
			.column("name")
			.unique()
			.execute();
	},
};
