import type { SnapState } from "./types";

export const isDeckComplete = (state: SnapState) => {
	return state.remaining === 0;
};
