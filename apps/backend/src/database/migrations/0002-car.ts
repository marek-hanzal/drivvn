import type { Migration } from "kysely";

export const CarMigration: Migration = {
	async up(db) {
		await db.schema
			.createTable("car")
			.addColumn("id", "integer", (column) => column.primaryKey().autoIncrement().notNull())
			.addColumn("colorId", "integer", (column) =>
				column.notNull().references("color.id").onDelete("restrict").onUpdate("cascade"),
			)
			.addColumn("make", "text", (column) => column.notNull())
			.addColumn("model", "text", (column) => column.notNull())
			.addColumn("builtAt", "text", (column) => column.notNull())
			.execute();

		await db.schema.createIndex("car_color_id_idx").on("car").column("colorId").execute();

		await db.schema
			.createIndex("car_make_model_idx")
			.on("car")
			.columns([
				"make",
				"model",
			])
			.execute();
	},
};
