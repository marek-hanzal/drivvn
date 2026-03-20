import { Effect } from "effect";
import { recreateTestDatabaseFx, TEST_DATABASE_PATH } from "~test/support/testDatabase";

export default async function init() {
	process.env.SERVER_DATABASE_PATH = TEST_DATABASE_PATH;
	await recreateTestDatabaseFx.pipe(Effect.runPromise);
}
