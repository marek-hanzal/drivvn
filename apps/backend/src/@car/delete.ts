import { createRoute } from "@hono/zod-openapi";
import type { NotFoundErrorFx, ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { carDeleteFx } from "~/@car/fx/carDeleteFx";
import { CarQuerySchema } from "~/@car/schema/CarQuerySchema";
import { CarSchema } from "~/@car/schema/CarSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import type { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withDeleteApiFx = Effect.fn("withDeleteApiFx")(function* () {
	const { carHono } = yield* RoutesContextFx;

	carHono.openapi(
		createRoute({
			method: "delete",
			path: "/delete",
			description: "Delete a car based on the provided query",
			operationId: "apiCarDelete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CarQuerySchema,
						},
					},
					description: "Query object for car deletion",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CarSchema,
						},
					},
					description: "The deleted car",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Car not found",
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
			summary: "Delete a car based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CarSchema,
						dataFx: carDeleteFx(c.req.valid("json")),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx(_: NotFoundErrorFx) {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeErrorFx(error: RuntimeErrorFx) {
						return c.json(noticeError(error), 500);
					},
					ZodErrorFx(error: ZodErrorFx<any>) {
						return c.json(noticeZodError(error.zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
