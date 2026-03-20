import { withDrawCardsExistingDeckMutation } from "@drivvn/sdk/mutation/drawCardsExistingDeck";
import { withGetShuffledDeckQuery } from "@drivvn/sdk/query/getShuffledDeck";
import { startTransition, useEffect, useState } from "react";
import { applyDrawResult } from "../service/snap/applyDrawResult";
import { createInitialSnapState } from "../service/snap/createInitialSnapState";
import { isDeckComplete } from "../service/snap/isDeckComplete";

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
	const [isDrawing, setIsDrawing] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: A new deck_id must reset local game state even when remaining returns to 52 again. */
	useEffect(() => {
		setState(createInitialSnapState(deck.remaining));
	}, [
		deck.deck_id,
		deck.remaining,
	]);

	/**
	 * Draw the next card from the current shuffled deck.
	 */
	const draw = async () => {
		setIsDrawing(true);

		try {
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
		} finally {
			setIsDrawing(false);
		}
	};

	/**
	 * Reset the game by invalidating and refetching the shuffled deck query.
	 */
	const reset = async () => {
		setIsResetting(true);

		try {
			await invalidateDeck();
			await deckQuery.refetch();
		} finally {
			setIsResetting(false);
		}
	};

	return {
		currentCard: state.currentCard,
		previousCard: state.previousCard,
		message: state.message,
		stats: {
			valueMatches: state.valueMatches,
			suitMatches: state.suitMatches,
		},
		isComplete: isDeckComplete(state),
		isDrawing,
		isResetting,
		draw,
		reset,
	} as const;
};
