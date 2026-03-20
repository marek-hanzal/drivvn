import { withDrawCardsExistingDeckMutation } from "@drivvn/sdk/mutation/drawCardsExistingDeck";
import { withGetShuffledDeckQuery } from "@drivvn/sdk/query/getShuffledDeck";
import { startTransition, useCallback, useEffect, useState } from "react";
import { applyDrawResult } from "../service/snap/applyDrawResult";
import { createInitialSnapState } from "../service/snap/createInitialSnapState";
import { getCardProgressLabel } from "../service/snap/getCardProgressLabel";
import { getNextSnapProbability } from "../service/snap/getNextSnapProbability";
import { isDeckComplete } from "../service/snap/isDeckComplete";

export namespace useSnapGame {
	export type Phase = "idle" | "starting" | "ready" | "drawing" | "resetting";
}

export type SnapGamePhase = useSnapGame.Phase;

export const useSnapGame = () => {
	const deckQuery = withGetShuffledDeckQuery.useSuspenseQuery({
		query: {
			deck_count: 1,
		},
	});
	const invalidateDeck = withGetShuffledDeckQuery.useInvalidate({
		query: {
			deck_count: 1,
		},
	});
	const drawCardsMutation = withDrawCardsExistingDeckMutation.useMutation();
	const deck = deckQuery.data;
	const [state, setState] = useState(() => createInitialSnapState(deck.remaining));
	const [phase, setPhase] = useState<useSnapGame.Phase>("idle");

	/* biome-ignore lint/correctness/useExhaustiveDependencies: A new deck_id must reset local game state even when remaining returns to 52 again. */
	useEffect(() => {
		setState(createInitialSnapState(deck.remaining));
		setPhase("idle");
	}, [
		deck.deck_id,
		deck.remaining,
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
				applyDrawResult(current, {
					card,
					remaining: result.remaining,
				}),
			);
		});
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
			await drawInternal();
			setPhase("ready");
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
			await drawInternal();
			setPhase("ready");
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

			const nextState = createInitialSnapState(nextDeckData.remaining);
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
					applyDrawResult(nextState, {
						card,
						remaining: result.remaining,
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

	return {
		phase,
		currentCard: state.currentCard,
		previousCard: state.previousCard,
		message: state.message,
		stats: {
			valueMatches: state.valueMatches,
			suitMatches: state.suitMatches,
		},
		progressLabel: getCardProgressLabel(state),
		nextSnapProbability: getNextSnapProbability(state),
		isComplete: isDeckComplete(state),
		start,
		draw,
		reset,
	} as const;
};
