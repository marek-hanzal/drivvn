import type { tCard } from "@drivvn/sdk/api/client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { applyDrawResult } from "../src/app/service/snap/applyDrawResult";
import { createInitialSnapState } from "../src/app/service/snap/createInitialSnapState";
import { SnapGame } from "../src/app/ui/SnapGame";

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
	it("shows the drawn card and keeps a placeholder when there is no previous card", async () => {
		const onDrawCard = vi.fn().mockResolvedValue({
			card: createCard({
				code: "AS",
				value: "ACE",
				suit: "SPADES",
			}),
			remaining: 51,
		});

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={vi.fn()}
			/>,
		);

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
		const onDrawCard = vi.fn().mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return next;
		});

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={vi.fn()}
			/>,
		);

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
		const onDrawCard = vi.fn().mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return next;
		});

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={vi.fn()}
			/>,
		);

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
		const onDrawCard = vi.fn().mockImplementation(async () => {
			const next = draws.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return next;
		});

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={vi.fn()}
			/>,
		);

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
		const onDrawCard = vi.fn().mockImplementation(async () => {
			const next = drawResults.shift();

			if (!next) {
				throw new Error("Missing mocked draw.");
			}

			return next;
		});

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={vi.fn()}
			/>,
		);

		for (let index = 0; index < 52; index++) {
			fireEvent.click(
				screen.getByRole("button", {
					name: "Draw card",
				}),
			);
			await waitFor(() => {
				expect(onDrawCard).toHaveBeenCalledTimes(index + 1);
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
		const onDrawCard = vi.fn().mockResolvedValue({
			card: createCard({
				code: "AS",
				value: "ACE",
				suit: "SPADES",
			}),
			remaining: 0,
		});
		const onReset = vi.fn().mockResolvedValue(undefined);

		render(
			<SnapGame
				deckId={"deck-1"}
				initialRemaining={52}
				onDrawCard={onDrawCard}
				onReset={onReset}
			/>,
		);

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
			expect(onReset).toHaveBeenCalledTimes(1);
		});
	});
});
