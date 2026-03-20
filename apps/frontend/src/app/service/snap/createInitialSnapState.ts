import type { DeckConfig } from "../../config/deck/DeckConfig";
import type { SnapState } from "./types";

export namespace createInitialSnapState {
	export interface Props {
		remaining: number;
		deckConfig: DeckConfig;
	}
}

export const createInitialSnapState = ({
	remaining,
	deckConfig,
}: createInitialSnapState.Props): SnapState => {
	return {
		currentCard: undefined,
		previousCard: undefined,
		message: undefined,
		deckConfig,
		valueMatches: 0,
		suitMatches: 0,
		drawnCount: 0,
		drawnValues: {},
		drawnSuits: {},
		remaining,
	};
};
