import { createRoute, z } from "@hono/zod-openapi";
import type { ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { colorCollectionFx } from "~/@color/fx/colorCollectionFx";
import { ColorItemSchema } from "~/@color/schema/ColorItemSchema";
import { ColorQuerySchema } from "~/@color/schema/ColorQuerySchema";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

const CollectionSchema = z.array(ColorItemSchema);

export const withCollectionApiFx = Effect.fn("withCollectionApiFx")(function* () {
	const { colorHono } = yield* RoutesContextFx;

	colorHono.openapi(
		createRoute({
			method: "post",
			path: "/collection",
			description: "Returns colors based on provided parameters",
			operationId: "apiColorCollection",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ColorQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CollectionSchema,
						},
					},
					description: "Access collection of colors based on provided query",
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
			summary: "Fetch a collection of colors based on the provided query",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: CollectionSchema,
						dataFx: colorCollectionFx({
							...c.req.valid("json"),
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
