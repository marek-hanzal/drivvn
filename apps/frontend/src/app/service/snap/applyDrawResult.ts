import { incrementCountByKey } from "./incrementCountByKey";
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
		drawnCount: state.drawnCount + 1,
		drawnValues: incrementCountByKey(state.drawnValues, card.value),
		drawnSuits: incrementCountByKey(state.drawnSuits, card.suit),
		remaining: normalizeRemaining(remaining),
	};
};
