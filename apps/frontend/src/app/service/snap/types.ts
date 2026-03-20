import type { tCard } from "@drivvn/sdk/api/client";
import type { DeckConfig } from "../../config/deck/DeckConfig";

export type SnapMessage = "SNAP VALUE!" | "SNAP SUIT!";

export interface DrawResult {
	card: tCard;
	remaining: number;
}

export type CountMap = Record<string, number>;

export interface SnapState {
	currentCard?: tCard;
	previousCard?: tCard;
	message?: SnapMessage;
	deckConfig: DeckConfig;
	valueMatches: number;
	suitMatches: number;
	drawnCount: number;
	drawnValues: CountMap;
	drawnSuits: CountMap;
	remaining: number;
}
