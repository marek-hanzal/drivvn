import type { SnapState } from "./types";

export namespace isDeckComplete {
	export interface Props {
		state: SnapState;
	}
}

export const isDeckComplete = ({ state }: isDeckComplete.Props) => {
	return state.remaining === 0;
};
