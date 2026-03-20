import { MigrationContextFx, withDatabaseFx } from "@use-pico/common/database";
import { Effect } from "effect";
import type { Database } from "~/database/Database";
import { migrations } from "~/database/migrations/migrations";

/**
 * Don't destructure stuff as there is Proxy
 */
export const database = withDatabaseFx<Database>({}).pipe(
	Effect.provideService(MigrationContextFx, migrations),
);
