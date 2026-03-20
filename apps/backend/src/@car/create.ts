import { createRoute } from "@hono/zod-openapi";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { carCreateFx } from "~/@car/fx/carCreateFx";
import { CarCreateSchema } from "~/@car/schema/CarCreateSchema";
import { CarSchema } from "~/@car/schema/CarSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { carHono } = yield* RoutesContextFx;

	carHono.openapi(
		createRoute({
			method: "post",
			path: "/cars",
			description: "Create a new car",
			operationId: "apiCarCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: CarCreateSchema,
						},
					},
					description: "Data for creating a new car",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: CarSchema,
						},
					},
					description: "The created car",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid car input",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Car not found after creation",
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
			summary: "Create a new car",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CarSchema,
						dataFx: carCreateFx(c.req.valid("json")),
					}),
					201,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					InvalidRequestErrorFx(error) {
						return c.json(noticeError(error), 400);
					},
					ZodErrorFx(error) {
						return c.json(noticeZodError(error.zod), 500);
					},
					RuntimeErrorFx(error) {
						return c.json(noticeError(error), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
