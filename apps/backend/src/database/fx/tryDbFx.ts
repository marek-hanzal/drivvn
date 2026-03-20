import { Effect } from "effect";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";

type DbError = Error & {
	code?: string;
};

function isDbError(error: unknown): error is DbError {
	return error instanceof Error && "code" in error;
}

export namespace tryDbFx {
	export type Handlers = Partial<Record<string, (e: DbError) => any>>;

	export type ErrorChannel<M extends Handlers> = {
		[K in keyof M]: M[K] extends (e: DbError) => infer R ? R : never;
	}[keyof M];
}

const tryDbFxImpl = Effect.fn("tryDbFx")(
	<TResult>(run: () => Promise<TResult>, handler?: tryDbFx.Handlers) =>
		Effect.tryPromise({
			try: run,
			catch: (error: unknown) => {
				if (isDbError(error)) {
					const code = error.code ?? "(no-code)";
					const mapped = handler?.[code]?.(error);
					if (mapped !== undefined) {
						return mapped;
					}

					return new RuntimeErrorFx({
						message: "Database Error",
						cause: error,
					});
				}

				if (error instanceof Error) {
					return new RuntimeErrorFx({
						message: "Generic Error",
						cause: error,
					});
				}

				return new RuntimeErrorFx({
					message: "Unknown Error",
					cause: error,
				});
			},
		}),
);

export function tryDbFx<TResult>(
	run: () => Promise<TResult>,
): Effect.Effect<TResult, RuntimeErrorFx>;

export function tryDbFx<TResult, const M extends tryDbFx.Handlers>(
	run: () => Promise<TResult>,
	handler: M & tryDbFx.Handlers,
): Effect.Effect<TResult, RuntimeErrorFx | tryDbFx.ErrorChannel<M>>;

export function tryDbFx(run: any, handler?: any) {
	return tryDbFxImpl(run, handler);
}
