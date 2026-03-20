import type { tCard } from "@drivvn/sdk/api/client";
import { describe, expect, it } from "vitest";
import { applyDrawResult } from "../src/app/service/snap/applyDrawResult";
import { createInitialSnapState } from "../src/app/service/snap/createInitialSnapState";
import { getCardProgressLabel } from "../src/app/service/snap/getCardProgressLabel";
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
	it("tracks card progress labels", () => {
		const state = applyDrawResult(createInitialSnapState(52), {
			card: createCard({
				code: "AH",
				value: "ACE",
				suit: "HEARTS",
			}),
			remaining: 51,
		});

		expect(getCardProgressLabel(state)).toBe("Card 1 of 52");
	});

	it("calculates the probability of the next value or suit match from drawn cards", () => {
		const firstDraw = applyDrawResult(createInitialSnapState(52), {
			card: createCard({
				code: "AH",
				value: "ACE",
				suit: "HEARTS",
			}),
			remaining: 51,
		});

		expect(getNextSnapProbability(firstDraw)).toBeCloseTo(15 / 51);

		const secondDraw = applyDrawResult(firstDraw, {
			card: createCard({
				code: "AC",
				value: "ACE",
				suit: "CLUBS",
			}),
			remaining: 50,
		});

		expect(getNextSnapProbability(secondDraw)).toBeCloseTo(14 / 50);
	});

	it("returns zero probability when there is no current card or no cards left", () => {
		const initialState = createInitialSnapState(52);

		expect(getNextSnapProbability(initialState)).toBe(0);

		const finishedState = applyDrawResult(initialState, {
			card: createCard({
				code: "KS",
				value: "KING",
				suit: "SPADES",
			}),
			remaining: 0,
		});

		expect(getNextSnapProbability(finishedState)).toBe(0);
	});
});
