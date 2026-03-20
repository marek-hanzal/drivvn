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

	const sameValueRemaining = 4 - (state.drawnValues[state.currentCard.value] ?? 0);
	const sameSuitRemaining = 13 - (state.drawnSuits[state.currentCard.suit] ?? 0);

	return Math.max(0, sameValueRemaining + sameSuitRemaining) / state.remaining;
};
