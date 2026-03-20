import { createRoute } from "@hono/zod-openapi";
import type { ZodErrorFx } from "@use-pico/common/error";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { colorCreateFx } from "~/@color/fx/colorCreateFx";
import { ColorCreateSchema } from "~/@color/schema/ColorCreateSchema";
import { ColorSchema } from "~/@color/schema/ColorSchema";
import { NotFoundNotice } from "~/@common/notice/NotFoundNotice";
import { noticeError } from "~/@common/notice/noticeError";
import { noticeZodError } from "~/@common/notice/noticeZodError";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withCatchFx } from "~/effect/withCatchFx";
import type { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCreateApiFx = Effect.fn("withCreateApiFx")(function* () {
	const { colorHono } = yield* RoutesContextFx;

	colorHono.openapi(
		createRoute({
			method: "post",
			path: "/create",
			description: "Create a new color",
			operationId: "apiColorCreate",
			request: {
				body: {
					content: {
						"application/json": {
							schema: ColorCreateSchema,
						},
					},
					description: "Data for creating a new color",
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: ColorSchema,
						},
					},
					description: "The created color",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Color not found after creation",
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
			summary: "Create a new color",
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(
					yield* zodGuardFx({
						schema: ColorSchema,
						dataFx: colorCreateFx(c.req.valid("json")),
					}),
					201,
				);
			}).pipe(
				withKyselyFx(c.get("kysely")),
				withCatchFx({
					NotFoundErrorFx() {
						return c.json(NotFoundNotice, 404);
					},
					ZodErrorFx(error: ZodErrorFx<any>) {
						return c.json(noticeZodError(error.zod), 500);
					},
					RuntimeErrorFx(error: RuntimeErrorFx) {
						return c.json(noticeError(error), 500);
					},
				}),
				Effect.runPromise,
			);
		},
	);
});
