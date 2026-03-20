import type { Effect } from "effect";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import type { testabase } from "~test/testabase";

export const withRuntimeFx = (database: Awaited<ReturnType<typeof testabase>>) => {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => eff.pipe(withKyselyFx(database), withDateFx);
};
