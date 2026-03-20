import { incrementCountByKey } from "./incrementCountByKey";
import { resolveSnapMessage } from "./resolveSnapMessage";
import type { DrawResult, SnapState } from "./types";

export namespace applyDrawResult {
	export interface Props {
		state: SnapState;
		drawResult: DrawResult;
	}
}

export const applyDrawResult = ({
	state,
	drawResult: { card, remaining },
}: applyDrawResult.Props): SnapState => {
	const message = resolveSnapMessage({
		previousCard: state.currentCard,
		currentCard: card,
	});

	return {
		currentCard: card,
		previousCard: state.currentCard,
		message,
		valueMatches: state.valueMatches + (message === "SNAP VALUE!" ? 1 : 0),
		suitMatches: state.suitMatches + (message === "SNAP SUIT!" ? 1 : 0),
		drawnCount: state.drawnCount + 1,
		drawnValues: incrementCountByKey({
			map: state.drawnValues,
			key: card.value,
		}),
		drawnSuits: incrementCountByKey({
			map: state.drawnSuits,
			key: card.suit,
		}),
		remaining,
	};
};
