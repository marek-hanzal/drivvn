import { createRoute } from "@hono/zod-openapi";
import type { NotFoundErrorFx, ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { colorFetchFx } from "~/@color/fx/colorFetchFx";
import { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";
import { ColorSchema } from "~/@color/schema/ColorSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withFetchApiFx = Effect.fn("withFetchApiFx")(function* () {
	const { colorHono } = yield* RoutesContextFx;

	colorHono.openapi(
		createRoute({
			method: "post",
			path: "/fetch",
			description: "Return a color based on the provided query",
			operationId: "apiColorFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ColorQuerySchema,
						},
					},
					description: "Query object for color fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ColorSchema,
						},
					},
					description: "Return a color based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Color not found",
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
				"Color",
			],
			summary: "Fetch a color based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: ColorSchema,
						dataFx: colorFetchFx(c.req.valid("json")),
					}),
					200,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx(_: NotFoundErrorFx) {
						return c.json(NotFoundNotice, 404);
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
