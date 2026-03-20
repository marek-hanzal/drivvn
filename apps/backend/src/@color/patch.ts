import { createRoute } from "@hono/zod-openapi";
import type { NotFoundErrorFx, ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { colorPatchFx } from "~/@color/fx/colorPatchFx";
import { ColorPatchSchema } from "~/@color/schema/ColorPatchSchema";
import { ColorSchema } from "~/@color/schema/ColorSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import type { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withPatchApiFx = Effect.fn("withPatchApiFx")(function* () {
	const { colorHono } = yield* RoutesContextFx;

	colorHono.openapi(
		createRoute({
			method: "patch",
			path: "/patch",
			description: "Update an existing color",
			operationId: "apiColorPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ColorPatchSchema,
						},
					},
					description: "Data for updating a color",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: ColorSchema,
						},
					},
					description: "The updated color",
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
			summary: "Update an existing color",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: ColorSchema,
						dataFx: colorPatchFx(c.req.valid("json")),
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
