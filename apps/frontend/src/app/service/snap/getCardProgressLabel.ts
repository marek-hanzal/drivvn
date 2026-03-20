import type { SnapState } from "./types";

export const getCardProgressLabel = (state: SnapState): string => {
	return `Card ${state.drawnCount} of 52`;
};
