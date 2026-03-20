import { normalizeRemaining } from "./normalizeRemaining";
import { resolveSnapMessage } from "./resolveSnapMessage";
import type { DrawResult, SnapState } from "./types";

export const applyDrawResult = (state: SnapState, { card, remaining }: DrawResult): SnapState => {
	const message = resolveSnapMessage(state.currentCard, card);

	return {
		currentCard: card,
		previousCard: state.currentCard,
		message,
		valueMatches: state.valueMatches + (message === "SNAP VALUE!" ? 1 : 0),
		suitMatches: state.suitMatches + (message === "SNAP SUIT!" ? 1 : 0),
		remaining: normalizeRemaining(remaining),
	};
};
