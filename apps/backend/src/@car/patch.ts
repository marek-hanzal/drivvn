import { createRoute } from "@hono/zod-openapi";
import type { NotFoundErrorFx, ZodErrorFx } from "@use-pico/common/error";
import { EntitySchema, zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { carPatchFx } from "~/@car/fx/carPatchFx";
import { CarPatchSchema } from "~/@car/schema/CarPatchSchema";
import { CarSchema } from "~/@car/schema/CarSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import type { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { carHono } = yield* RoutesContextFx;

	carHono.openapi(
		createRoute({
			method: "patch",
			path: "/cars/{id}",
			description: "Update an existing car",
			operationId: "apiCarPatch",
			request: {
				params: EntitySchema,
				body: {
					content: {
						"application/json": {
							schema: CarPatchSchema.shape.patch,
						},
					},
					description: "Data for updating a car",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CarSchema,
						},
					},
					description: "The updated car",
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
			summary: "Update an existing car",
		}),
		async (c) => {
			const { id } = c.req.valid("param");

			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CarSchema,
						dataFx: carPatchFx({
							/**
							 * Just to keep the inconsistent API somewhat consistent:
							 *
							 * This request should be as whole from the body.
							 */
							patch: c.req.valid("json"),
							query: {
								where: {
									id,
								},
							},
						}),
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
