import { Effect } from "effect";
import { beforeEach } from "vitest";
import { recreateTestDatabaseFx, TEST_DATABASE_PATH } from "~test/support/testDatabase";

process.env.SERVER_DATABASE_PATH = TEST_DATABASE_PATH;

beforeEach(() => recreateTestDatabaseFx.pipe(Effect.runPromise));
