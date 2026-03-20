import z from "zod";

export const ServerViteSchema = z
	.looseObject({
		VITE_SERVER_API: z.url(),
	})
	.strip();

export type ServerViteSchema = typeof ServerViteSchema;

export namespace ServerViteSchema {
	export type Type = z.infer<ServerViteSchema>;
}
