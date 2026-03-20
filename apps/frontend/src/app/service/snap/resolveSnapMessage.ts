import type { tCard } from "@drivvn/sdk/api/client";
import type { SnapMessage } from "./types";

export namespace resolveSnapMessage {
	export interface Props {
		previousCard: tCard | undefined;
		currentCard: tCard;
	}
}

export const resolveSnapMessage = ({
	previousCard,
	currentCard,
}: resolveSnapMessage.Props): SnapMessage | undefined => {
	if (!previousCard) {
		return undefined;
	}

	if (previousCard.value === currentCard.value) {
		return "SNAP VALUE!";
	}

	if (previousCard.suit === currentCard.suit) {
		return "SNAP SUIT!";
	}

	return undefined;
};
