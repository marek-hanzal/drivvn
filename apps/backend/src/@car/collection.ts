import { createRoute, z } from "@hono/zod-openapi";
import type { ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { carCollectionFx } from "~/@car/fx/carCollectionFx";
import { CarItemSchema } from "~/@car/schema/CarItemSchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(CarItemSchema);

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { carHono } = yield* RoutesContextFx;

	carHono.openapi(
		createRoute({
			method: "get",
			path: "/cars",
			description: "Returns car collection (default set)",
			operationId: "apiCarCollection",
			request: {},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of cars based on provided query",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"Car",
			],
			summary: "Fetch a collection of cars based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: carCollectionFx({
							/**
							 * Hardcoded limitations, but we may switch the whole endpoint to "POST" and
							 * whole query object can be passed down the collection.
							 *
							 * Or eventually we can extract some of the values to "query" params and use them here.
							 */
							cursor: {
								page: 0,
								size: 200,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					ZodErrorFx(error: ZodErrorFx<any>) {
						return c.json(noticeZodError(error.zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
