import type { SnapState } from "./types";

export namespace createInitialSnapState {
	export interface Props {
		remaining: number;
	}
}

export const createInitialSnapState = ({ remaining }: createInitialSnapState.Props): SnapState => {
	return {
		currentCard: undefined,
		previousCard: undefined,
		message: undefined,
		valueMatches: 0,
		suitMatches: 0,
		drawnCount: 0,
		drawnValues: {},
		drawnSuits: {},
		remaining,
	};
};
