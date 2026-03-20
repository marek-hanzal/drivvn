import type { SnapState } from "./types";

export namespace getNextSnapProbability {
	export interface Props {
		state: SnapState;
	}
}

export const getNextSnapProbability = ({ state }: getNextSnapProbability.Props): number => {
	if (!state.currentCard || state.remaining <= 0) {
		return 0;
	}

	/**
	 * The probability model does not assume a hardcoded 52-card deck here.
	 * Instead it uses the deck shape stored in state:
	 * - `deckConfig.copiesPerValue`: how many cards in the full deck share one value
	 * - `deckConfig.cardsPerSuit`: how many cards in the full deck share one suit
	 *
	 * `drawnValues` and `drawnSuits` include the current card, so subtracting those counts
	 * tells us how many favorable cards are still left for the next draw.
	 *
	 * We can safely add the two counts together because the only card that could match both
	 * value and suit is the current card itself, and that card has already been drawn.
	 */
	const sameValueRemaining =
		state.deckConfig.copiesPerValue - (state.drawnValues[state.currentCard.value] ?? 0);
	const sameSuitRemaining =
		state.deckConfig.cardsPerSuit - (state.drawnSuits[state.currentCard.suit] ?? 0);

	return Math.max(0, sameValueRemaining + sameSuitRemaining) / state.remaining;
};
