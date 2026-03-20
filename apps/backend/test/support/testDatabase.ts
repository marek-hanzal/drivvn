import { mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DialectContextFx } from "@use-pico/common/database";
import Database from "better-sqlite3";
import { Effect } from "effect";
import { CompiledQuery, SqliteDialect } from "kysely";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { database } from "~/database/kysely";

export const TEST_DATABASE_PATH = fileURLToPath(
	new URL("../.tmp/backend.test.sqlite", import.meta.url),
);

const testKyselyContextFx = Effect.gen(function* () {
	return yield* database.pipe(
		Effect.provideService(
			DialectContextFx,
			new SqliteDialect({
				database: new Database(TEST_DATABASE_PATH),
				async onCreateConnection(connection) {
					await connection.executeQuery(CompiledQuery.raw("PRAGMA foreign_keys = ON"));
					await connection.executeQuery(CompiledQuery.raw("PRAGMA journal_mode = WAL"));
					await connection.executeQuery(CompiledQuery.raw("PRAGMA busy_timeout = 5000"));
				},
			}),
		),
	);
});

export const withTestKyselyFx = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
	Effect.gen(function* () {
		const kysely = yield* testKyselyContextFx;

		return yield* effect.pipe(withKyselyFx(kysely));
	});

export const migrateTestDatabaseFx = Effect.gen(function* () {
	const kysely = yield* testKyselyContextFx;

	yield* Effect.promise(() => kysely.migrate());
});

export const recreateTestDatabaseFx = Effect.gen(function* () {
	yield* Effect.promise(() =>
		mkdir(dirname(TEST_DATABASE_PATH), {
			recursive: true,
		}),
	);

	for (const path of [
		TEST_DATABASE_PATH,
		`${TEST_DATABASE_PATH}-shm`,
		`${TEST_DATABASE_PATH}-wal`,
	]) {
		yield* Effect.promise(() =>
			rm(path, {
				force: true,
			}),
		);
	}

	yield* migrateTestDatabaseFx;
});
