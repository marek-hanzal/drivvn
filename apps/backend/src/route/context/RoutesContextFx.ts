import { Context } from "effect";
import type { withCarHono } from "~/@car/withCarHono";
import type { withHono } from "~/hono/withHono";

export interface RoutesContext {
	/**
	 * Root app hono (/ route)
	 */
	root: withHono;
	/**
	 * Domain specific hono's ("root" routes, usually using different separation).
	 */
	carHono: withCarHono;
}

export class RoutesContextFx extends Context.Tag("RoutesContextFx")<
	RoutesContextFx,
	RoutesContext
>() {
	//
}
