import type { SnapState } from "./types";

export namespace getCardProgressLabel {
	export interface Props {
		state: SnapState;
	}
}

export const getCardProgressLabel = ({ state }: getCardProgressLabel.Props): string => {
	return `Card ${state.drawnCount} of 52`;
};
