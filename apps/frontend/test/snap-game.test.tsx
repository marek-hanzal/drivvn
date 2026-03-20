import type { tCard } from "@drivvn/sdk/api/client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SnapGame } from "../src/app/ui/SnapGame";

let start = vi.fn(async () => {});
let draw = vi.fn(async () => {});
let reset = vi.fn(async () => {});
let hookState: {
	hasStarted: boolean;
	currentCard?: tCard;
	previousCard?: tCard;
	message?: string;
	stats: {
		valueMatches: number;
		suitMatches: number;
	};
	progressLabel: string;
	nextSnapProbability: number;
	isComplete: boolean;
	isDrawing: boolean;
	isResetting: boolean;
};

vi.mock("../src/app/hook/useSnapGame", () => ({
	useSnapGame: () => ({
		...hookState,
		start,
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
			hasStarted: false,
			currentCard: undefined,
			previousCard: undefined,
			message: undefined,
			stats: {
				valueMatches: 0,
				suitMatches: 0,
			},
			progressLabel: "Card 0 of 52",
			nextSnapProbability: 0,
			isComplete: false,
			isDrawing: false,
			isResetting: false,
		};
		start = vi.fn(async () => {});
		draw = vi.fn(async () => {});
		reset = vi.fn(async () => {});
	});

	it("shows intro status before the game starts", () => {
		render(<SnapGame />);

		expect(screen.getByText("Snap Game!")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Start",
			}),
		).toBeInTheDocument();
		expect(screen.queryByText("Card 0 of 52")).not.toBeInTheDocument();
		expect(screen.queryByText("Value matches: 0")).not.toBeInTheDocument();
	});

	it("calls start through the control hook", async () => {
		render(<SnapGame />);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Start",
			}),
		);

		await waitFor(() => {
			expect(start).toHaveBeenCalledTimes(1);
		});
	});

	it("shows placeholders and live stats after the game starts", () => {
		hookState = {
			...hookState,
			hasStarted: true,
		};

		render(<SnapGame />);

		expect(screen.getAllByLabelText("Card placeholder")).toHaveLength(2);
		expect(screen.getByText("Card 0 of 52")).toBeInTheDocument();
		expect(screen.getByText("Next snap chance: 0.0%")).toBeInTheDocument();
		expect(screen.getByText("Value matches: 0")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 0")).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: "Draw card",
			}),
		).toBeInTheDocument();
	});

	it("renders cards, snap message and live stats from the control hook", async () => {
		hookState = {
			hasStarted: true,
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
			progressLabel: "Card 12 of 52",
			nextSnapProbability: 0.325,
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
		expect(screen.getByText("Card 12 of 52")).toBeInTheDocument();
		expect(screen.getByText("Next snap chance: 32.5%")).toBeInTheDocument();
		expect(screen.getByText("Value matches: 1")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 4")).toBeInTheDocument();
	});

	it("calls draw through the control hook", async () => {
		hookState = {
			...hookState,
			hasStarted: true,
		};

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

	it("shows reset instead of draw when the game is complete and calls reset", async () => {
		hookState = {
			hasStarted: true,
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
			progressLabel: "Card 52 of 52",
			nextSnapProbability: 0,
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
		expect(screen.getByText("Card 52 of 52")).toBeInTheDocument();
		expect(screen.getByText("Next snap chance: 0.0%")).toBeInTheDocument();
		expect(screen.getByText("Value matches: 9")).toBeInTheDocument();
		expect(screen.getByText("Suit matches: 4")).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole("button", {
				name: "Reset",
			}),
		);

		await waitFor(() => {
			expect(reset).toHaveBeenCalledTimes(1);
		});
	});
});
