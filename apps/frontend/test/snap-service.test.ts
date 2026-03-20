import type { tCard } from "@drivvn/sdk/api/client";
import { describe, expect, it } from "vitest";
import { createStandardDeckConfig } from "../src/app/config/deck/DeckConfig";
import { applyDrawResult } from "../src/app/service/snap/applyDrawResult";
import { createInitialSnapState } from "../src/app/service/snap/createInitialSnapState";
import { getNextSnapProbability } from "../src/app/service/snap/getNextSnapProbability";

const createCard = ({
	code,
	value,
	suit,
}: {
	code: string;
	value: string;
	suit: tCard["suit"];
}): tCard => {
	return {
		code,
		value,
		suit,
		image: `https://deckofcardsapi.com/static/img/${code}.png`,
		images: {
			png: `https://deckofcardsapi.com/static/img/${code}.png`,
			svg: `https://deckofcardsapi.com/static/img/${code}.svg`,
		},
	};
};

describe("snap service", () => {
	const deckConfig = createStandardDeckConfig({
		deckCount: 1,
	});

	it("tracks total cards from the initial deck state", () => {
		const state = applyDrawResult({
			state: createInitialSnapState({
				remaining: 52,
				deckConfig,
			}),
			drawResult: {
				card: createCard({
					code: "AH",
					value: "ACE",
					suit: "HEARTS",
				}),
				remaining: 51,
			},
		});

		expect(state.deckConfig.totalCards).toBe(52);
		expect(state.drawnCount).toBe(1);
	});

	it("calculates the probability of the next value or suit match from drawn cards", () => {
		const firstDraw = applyDrawResult({
			state: createInitialSnapState({
				remaining: 52,
				deckConfig,
			}),
			drawResult: {
				card: createCard({
					code: "AH",
					value: "ACE",
					suit: "HEARTS",
				}),
				remaining: 51,
			},
		});

		expect(
			getNextSnapProbability({
				state: firstDraw,
			}),
		).toBeCloseTo(15 / 51);

		const secondDraw = applyDrawResult({
			state: firstDraw,
			drawResult: {
				card: createCard({
					code: "AC",
					value: "ACE",
					suit: "CLUBS",
				}),
				remaining: 50,
			},
		});

		expect(
			getNextSnapProbability({
				state: secondDraw,
			}),
		).toBeCloseTo(14 / 50);
	});

	it("returns zero probability when there is no current card or no cards left", () => {
		const initialState = createInitialSnapState({
			remaining: 52,
			deckConfig,
		});

		expect(
			getNextSnapProbability({
				state: initialState,
			}),
		).toBe(0);

		const finishedState = applyDrawResult({
			state: initialState,
			drawResult: {
				card: createCard({
					code: "KS",
					value: "KING",
					suit: "SPADES",
				}),
				remaining: 0,
			},
		});

		expect(
			getNextSnapProbability({
				state: finishedState,
			}),
		).toBe(0);
	});
});
