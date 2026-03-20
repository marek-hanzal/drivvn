import type { tCard } from "@drivvn/sdk/api/client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SnapGame } from "../src/app/ui/SnapGame";

let draw = vi.fn(async () => {});
let reset = vi.fn(async () => {});
let hookState: {
	currentCard?: tCard;
	previousCard?: tCard;
	message?: string;
	stats: {
		valueMatches: number;
		suitMatches: number;
	};
	isComplete: boolean;
	isDrawing: boolean;
	isResetting: boolean;
};

vi.mock("../src/app/hook/useSnapGame", () => ({
	useSnapGame: () => ({
		...hookState,
		draw,
		reset,
	}),
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
		hookState = {
			currentCard: undefined,
			previousCard: undefined,
			message: undefined,
			stats: {
				valueMatches: 0,
				suitMatches: 0,
			},
			isComplete: false,
			isDrawing: false,
			isResetting: false,
		};
		draw = vi.fn(async () => {});
		reset = vi.fn(async () => {});
	});

	it("shows placeholders and live stats before any draw", () => {
		render(<SnapGame />);

		expect(screen.getAllByLabelText("Card placeholder")).toHaveLength(2);
		expect(screen.getByText("Value matches: 0")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 0")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		).toBeInTheDocument();
	});

	it("renders cards and snap message from the control hook", async () => {
		hookState = {
			currentCard: createCard({
				code: "JD",
				value: "JACK",
				suit: "DIAMONDS",
			}),
			previousCard: createCard({
				code: "QD",
				value: "QUEEN",
				suit: "DIAMONDS",
			}),
			message: "SNAP SUIT!",
			stats: {
				valueMatches: 1,
				suitMatches: 4,
			},
			isComplete: false,
			isDrawing: false,
			isResetting: false,
		};

		render(<SnapGame />);

		await screen.findByRole("img", {
			name: "queen of diamonds",
		});
		expect(
			screen.getByRole("img", {
				name: "jack of diamonds",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("SNAP SUIT!")).toBeInTheDocument();
		expect(screen.getByText("Value matches: 1")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 4")).toBeInTheDocument();
	});

	it("calls draw through the control hook", async () => {
		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		);

		await waitFor(() => {
			expect(draw).toHaveBeenCalledTimes(1);
		});
	});

	it("shows reset instead of draw when the game is complete", () => {
		hookState = {
			currentCard: createCard({
				code: "AS",
				value: "ACE",
				suit: "SPADES",
			}),
			previousCard: createCard({
				code: "AH",
				value: "ACE",
				suit: "HEARTS",
			}),
			message: "SNAP VALUE!",
			stats: {
				valueMatches: 9,
				suitMatches: 4,
			},
			isComplete: true,
			isDrawing: false,
			isResetting: false,
		};

		render(<SnapGame />);

		expect(
			screen.queryByRole("button", {
				name: "Draw card",
			}),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Reset",
			}),
		).toBeInTheDocument();
		expect(screen.getByText("Value matches: 9")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 4")).toBeInTheDocument();
	});

	it("calls reset through the control hook", async () => {
		hookState = {
			currentCard: undefined,
			previousCard: undefined,
			message: undefined,
			stats: {
				valueMatches: 0,
				suitMatches: 0,
			},
			isComplete: true,
			isDrawing: false,
			isResetting: false,
		};

		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Reset",
			}),
		);

		await waitFor(() => {
			expect(reset).toHaveBeenCalledTimes(1);
		});
	});

	it("disables action buttons based on control state", () => {
		hookState = {
			currentCard: undefined,
			previousCard: undefined,
			message: undefined,
			stats: {
				valueMatches: 0,
				suitMatches: 0,
			},
			isComplete: false,
			isDrawing: true,
			isResetting: false,
		};

		const { rerender } = render(<SnapGame />);

		expect(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		).toBeDisabled();

		hookState = {
			...hookState,
			isComplete: true,
			isDrawing: false,
			isResetting: true,
		};
		rerender(<SnapGame />);

		expect(
			screen.getByRole("button", {
				name: "Reset",
			}),
		).toBeDisabled();
	});
});
