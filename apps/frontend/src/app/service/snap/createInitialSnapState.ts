import type { tRemaining } from "@drivvn/sdk/api/client";
import { normalizeRemaining } from "./normalizeRemaining";
import type { SnapState } from "./types";

export const createInitialSnapState = (remaining: tRemaining): SnapState => {
	return {
		currentCard: undefined,
		previousCard: undefined,
		message: undefined,
		valueMatches: 0,
		suitMatches: 0,
		remaining: normalizeRemaining(remaining),
	};
};
