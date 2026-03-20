import { withDrawCardsExistingDeckMutation } from "@drivvn/sdk/mutation/drawCardsExistingDeck";
import { withGetShuffledDeckQuery } from "@drivvn/sdk/query/getShuffledDeck";
import { startTransition, useCallback, useEffect, useState } from "react";
import { snapDeckConfig } from "../config/deck/DeckConfig";
import { applyDrawResult } from "../service/snap/applyDrawResult";
import { createInitialSnapState } from "../service/snap/createInitialSnapState";
import { getNextSnapProbability } from "../service/snap/getNextSnapProbability";

export namespace useSnapGame {
	export type Phase =
		| "idle"
		| "starting"
		| "ready"
		| "drawing"
		| "resetting"
		| "refreshing"
		| "completed";
}

export type SnapGamePhase = useSnapGame.Phase;

export const useSnapGame = () => {
	const deckQuery = withGetShuffledDeckQuery.useSuspenseQuery({
		query: {
			deck_count: snapDeckConfig.deckCount,
		},
	});
	const invalidateDeck = withGetShuffledDeckQuery.useInvalidate({
		query: {
			deck_count: snapDeckConfig.deckCount,
		},
	});
	const drawCardsMutation = withDrawCardsExistingDeckMutation.useMutation();
	const deck = deckQuery.data;
	const totalCards = Number(deck.remaining);
	const [state, setState] = useState(() =>
		createInitialSnapState({
			remaining: totalCards,
			deckConfig: snapDeckConfig,
		}),
	);
	const [phase, setPhase] = useState<useSnapGame.Phase>("idle");

	/* biome-ignore lint/correctness/useExhaustiveDependencies: Only a new deck_id should reset local game state; deck remaining changes during play must not wipe progress. */
	useEffect(() => {
		setState(
			createInitialSnapState({
				remaining: totalCards,
				deckConfig: snapDeckConfig,
			}),
		);
		setPhase((current) =>
			current === "resetting" || current === "refreshing" ? current : "idle",
		);
	}, [
		deck.deck_id,
	]);

	const drawInternal = useCallback(async () => {
		const result = await drawCardsMutation.mutateAsync({
			path: {
				deck_id: deck.deck_id,
			},
			query: {
				count: 1,
			},
		});
		const [card] = result.cards;

		if (!card) {
			throw new Error("Draw endpoint returned no card.");
		}

		startTransition(() => {
			setState((current) =>
				applyDrawResult({
					state: current,
					drawResult: {
						card,
						remaining: Number(result.remaining),
					},
				}),
			);
		});

		return Number(result.remaining) === 0;
	}, [
		deck.deck_id,
		drawCardsMutation,
	]);

	/**
	 * Start the game and immediately draw the first card from the shuffled deck.
	 */
	const start = useCallback(async () => {
		setPhase("starting");

		try {
			const isComplete = await drawInternal();
			setPhase(isComplete ? "completed" : "ready");
		} catch (error) {
			setPhase("idle");
			throw error;
		}
	}, [
		drawInternal,
	]);

	/**
	 * Draw the next card from the current shuffled deck.
	 */
	const draw = useCallback(async () => {
		setPhase("drawing");

		try {
			const isComplete = await drawInternal();
			setPhase(isComplete ? "completed" : "ready");
		} catch (error) {
			setPhase("ready");
			throw error;
		}
	}, [
		drawInternal,
	]);

	/**
	 * Reset the game by invalidating the shuffled deck query and immediately starting a fresh run.
	 */
	const reset = useCallback(async () => {
		setPhase("resetting");

		try {
			await invalidateDeck();
			const nextDeck = await deckQuery.refetch();
			const nextDeckData = nextDeck.data;

			if (!nextDeckData) {
				throw new Error("Shuffled deck query returned no deck.");
			}

			const nextState = createInitialSnapState({
				remaining: Number(nextDeckData.remaining),
				deckConfig: snapDeckConfig,
			});
			const result = await drawCardsMutation.mutateAsync({
				path: {
					deck_id: nextDeckData.deck_id,
				},
				query: {
					count: 1,
				},
			});
			const [card] = result.cards;

			if (!card) {
				throw new Error("Draw endpoint returned no card.");
			}

			startTransition(() => {
				setState(
					applyDrawResult({
						state: nextState,
						drawResult: {
							card,
							remaining: Number(result.remaining),
						},
					}),
				);
			});
			setPhase("ready");
		} catch (error) {
			setPhase("ready");
			throw error;
		}
	}, [
		deckQuery,
		drawCardsMutation,
		invalidateDeck,
	]);

	/**
	 * Start fresh by loading a new shuffled deck and returning to the intro state.
	 */
	const startFresh = useCallback(async () => {
		setPhase("refreshing");

		try {
			await invalidateDeck();
			const nextDeck = await deckQuery.refetch();

			if (!nextDeck.data) {
				throw new Error("Shuffled deck query returned no deck.");
			}

			setPhase("idle");
		} catch (error) {
			setPhase("completed");
			throw error;
		}
	}, [
		deckQuery,
		invalidateDeck,
	]);

	return {
		phase,
		currentCard: state.currentCard,
		previousCard: state.previousCard,
		message: state.message,
		totalCards: state.deckConfig.totalCards,
		drawnCount: state.drawnCount,
		stats: {
			valueMatches: state.valueMatches,
			suitMatches: state.suitMatches,
		},
		nextSnapProbability: getNextSnapProbability({
			state,
		}),
		start,
		draw,
		reset,
		startFresh,
	} as const;
};
