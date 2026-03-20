import { createRoute } from "@hono/zod-openapi";
import { EntitySchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { carDeleteFx } from "~/@car/fx/carDeleteFx";
import { CarSchema } from "~/@car/schema/CarSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withDeleteApiFx = Effect.fn("withDeleteApiFx")(function* () {
	const { carHono } = yield* RoutesContextFx;

	carHono.openapi(
		createRoute({
			method: "delete",
			path: "/cars/{id}",
			description: "Delete a car based on the ID",
			operationId: "apiCarDelete",
			request: {
				params: EntitySchema,
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
			const { id } = c.req.valid("param");

			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CarSchema,
						dataFx: carDeleteFx({
							where: {
								id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					RuntimeErrorFx(error) {
						return c.json(noticeError(error), 500);
					},
					ZodErrorFx(error) {
						return c.json(noticeZodError(error.zod), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
