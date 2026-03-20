import z from "zod";

export const ServerDatabaseSchema = z.object({
	SERVER_DATABASE_PATH: z.string().min(1, "Database path is required"),
});
