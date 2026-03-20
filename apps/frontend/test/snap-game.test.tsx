import type { tCard, tDeckResponse, tDrawCardsExistingDeckResponse } from "@drivvn/sdk/api/client";
import type { tSuccessResponse } from "@drivvn/sdk/mutation/_shared";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyDrawResult } from "../src/app/service/snap/applyDrawResult";
import { createInitialSnapState } from "../src/app/service/snap/createInitialSnapState";
import { SnapGame } from "../src/app/ui/SnapGame";

let currentDeck: tSuccessResponse<tDeckResponse>;
let invalidateDeck = vi.fn(async () => {});
let refetchDeck = vi.fn(async () => ({
	data: currentDeck,
}));
let drawCard =
	vi.fn<
		(args: {
			path: {
				deck_id: string;
			};
			query: {
				count: number;
			};
		}) => Promise<tSuccessResponse<tDrawCardsExistingDeckResponse[200]>>
	>();

vi.mock("@drivvn/sdk/query/getShuffledDeck", () => ({
	withGetShuffledDeckQuery: {
		useSuspenseQuery: () => ({
			data: currentDeck,
			refetch: refetchDeck,
		}),
		useInvalidate: () => invalidateDeck,
	},
}));

vi.mock("@drivvn/sdk/mutation/drawCardsExistingDeck", () => ({
	withDrawCardsExistingDeckMutation: {
		useMutation: () => ({
			mutateAsync: drawCard,
		}),
	},
}));

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

describe("SnapGame", () => {
	beforeEach(() => {
		currentDeck = {
			success: true,
			deck_id: "deck-1",
			shuffled: true,
			remaining: 52,
		};
		invalidateDeck = vi.fn(async () => {});
		refetchDeck = vi.fn(async () => ({
			data: currentDeck,
		}));
		drawCard = vi.fn();
	});

	it("shows the drawn card and keeps a placeholder when there is no previous card", async () => {
		drawCard.mockResolvedValue({
			success: true,
			deck_id: "deck-1",
			cards: [
				createCard({
					code: "AS",
					value: "ACE",
					suit: "SPADES",
				}),
			],
			remaining: 51,
		});

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);

		await screen.findByRole("img", {
			name: "ace of spades",
		});
		expect(screen.getByLabelText("Card placeholder")).toBeInTheDocument();
		expect(screen.queryByText("SNAP VALUE!")).not.toBeInTheDocument();
		expect(screen.queryByText("SNAP SUIT!")).not.toBeInTheDocument();
	});

	it("shows SNAP VALUE! when consecutive cards match by value", async () => {
		const draws = [
			{
				card: createCard({
					code: "5S",
					value: "5",
					suit: "SPADES",
				}),
				remaining: 51,
			},
			{
				card: createCard({
					code: "5H",
					value: "5",
					suit: "HEARTS",
				}),
				remaining: 50,
			},
		];
		drawCard.mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return {
				success: true,
				deck_id: "deck-1",
				cards: [
					next.card,
				],
				remaining: next.remaining,
			};
		});

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByRole("img", {
			name: "5 of spades",
		});

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByText("SNAP VALUE!");
	});

	it("shows SNAP SUIT! when consecutive cards match by suit", async () => {
		const draws = [
			{
				card: createCard({
					code: "9C",
					value: "9",
					suit: "CLUBS",
				}),
				remaining: 51,
			},
			{
				card: createCard({
					code: "2C",
					value: "2",
					suit: "CLUBS",
				}),
				remaining: 50,
			},
		];
		drawCard.mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return {
				success: true,
				deck_id: "deck-1",
				cards: [
					next.card,
				],
				remaining: next.remaining,
			};
		});

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByRole("img", {
			name: "9 of clubs",
		});

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByText("SNAP SUIT!");
	});

	it("shows no snap message when neither value nor suit match", async () => {
		const draws = [
			{
				card: createCard({
					code: "KD",
					value: "KING",
					suit: "DIAMONDS",
				}),
				remaining: 51,
			},
			{
				card: createCard({
					code: "3S",
					value: "3",
					suit: "SPADES",
				}),
				remaining: 50,
			},
		];
		drawCard.mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return {
				success: true,
				deck_id: "deck-1",
				cards: [
					next.card,
				],
				remaining: next.remaining,
			};
		});

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByRole("img", {
			name: "king of diamonds",
		});

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByRole("img", {
			name: "3 of spades",
		});

		expect(screen.queryByText("SNAP VALUE!")).not.toBeInTheDocument();
		expect(screen.queryByText("SNAP SUIT!")).not.toBeInTheDocument();
	});

	it("replaces the draw button with totals after all 52 cards are drawn", async () => {
		const suits = [
			"SPADES",
			"HEARTS",
			"CLUBS",
			"DIAMONDS",
		] as const;
		const drawResults = Array.from(
			{
				length: 52,
			},
			(_, index) => {
				// biome-ignore lint/style/noNonNullAssertion: The tuple is non-empty and modulo keeps the index in range.
				const suit = suits[index % suits.length]!;
				const value = index % 13 === 0 ? "ACE" : ((index % 13) + 1).toString();

				return {
					card: createCard({
						code: `${index}X`,
						value,
						suit,
					}),
					remaining: 51 - index,
				};
			},
		);

		const expectedTotals = drawResults.reduce(
			(state, draw) => applyDrawResult(state, draw),
			createInitialSnapState(52),
		);
		drawCard.mockImplementation(async () => {
			const next = drawResults.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return {
				success: true,
				deck_id: "deck-1",
				cards: [
					next.card,
				],
				remaining: next.remaining,
			};
		});

		render(<SnapGame />);

		for (let index = 0; index < 52; index++) {
			fireEvent.click(
				screen.getByRole("button", {
					name: "Draw card",
				}),
			);
			await waitFor(() => {
				expect(drawCard).toHaveBeenCalledTimes(index + 1);
			});
		}

		await waitFor(() => {
			expect(
				screen.queryByRole("button", {
					name: "Draw card",
				}),
			).not.toBeInTheDocument();
		});
		expect(
			screen.getByText(`Value matches: ${expectedTotals.valueMatches}`),
		).toBeInTheDocument();
		expect(screen.getByText(`Suit matches: ${expectedTotals.suitMatches}`)).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Reset",
			}),
		).toBeInTheDocument();
	});

	it("resets the game when reset is clicked after the deck is complete", async () => {
		drawCard.mockResolvedValue({
			success: true,
			deck_id: "deck-1",
			cards: [
				createCard({
					code: "AS",
					value: "ACE",
					suit: "SPADES",
				}),
			],
			remaining: 0,
		});
		invalidateDeck = vi.fn(async () => {
			currentDeck = {
				success: true,
				deck_id: "deck-2",
				shuffled: true,
				remaining: 52,
			};
		});

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);
		await screen.findByRole("button", {
			name: "Reset",
		});

		fireEvent.click(
			screen.getByRole("button", {
				name: "Reset",
			}),
		);

		await waitFor(() => {
			expect(invalidateDeck).toHaveBeenCalledTimes(1);
			expect(refetchDeck).toHaveBeenCalledTimes(1);
		});
	});
});
