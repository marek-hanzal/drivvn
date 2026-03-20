import type { tCard, tRemaining } from "@drivvn/sdk/api/client";

export type SnapMessage = "SNAP VALUE!" | "SNAP SUIT!";

export interface DrawResult {
	card: tCard;
	remaining: tRemaining;
}

export type CountMap = Record<string, number>;

export interface SnapState {
	currentCard?: tCard;
	previousCard?: tCard;
	message?: SnapMessage;
	valueMatches: number;
	suitMatches: number;
	drawnCount: number;
	drawnValues: CountMap;
	drawnSuits: CountMap;
	remaining: number;
}
