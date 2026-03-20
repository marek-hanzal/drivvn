import { createRoute } from "@hono/zod-openapi";
import type { ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { colorCountFx } from "~/@color/fx/colorCountFx";
import { ColorCountQuerySchema } from "~/@color/schema/ColorCountQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { CountSchema } from "~/schema/CountSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApiFx = Effect.fn("withCountApiFx")(function* () {
	const { colorHono } = yield* RoutesContextFx;

	colorHono.openapi(
		createRoute({
			method: "post",
			path: "/count",
			description: "Returns count of colors based on provided query",
			operationId: "apiColorCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ColorCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
			summary: "Count colors based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CountSchema,
						dataFx: colorCountFx(c.req.valid("json")),
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
