import { withDrawCardsExistingDeckMutation } from "@drivvn/sdk/mutation/drawCardsExistingDeck";
import { withGetShuffledDeckMutation } from "@drivvn/sdk/mutation/getShuffledDeck";
import { withGetShuffledDeckQuery } from "@drivvn/sdk/query/getShuffledDeck";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { useState } from "react";
import { SnapGame } from "~/app/ui/SnapGame";

export const Route = createFileRoute("/")({
	async loader({ context }) {
		return await withGetShuffledDeckQuery.ensure(context.queryClient, {
			query: {
				deck_count: 1,
			},
		});
	},
	component() {
		const initialDeck = Route.useLoaderData();
		const [deck, setDeck] = useState(initialDeck);
		const drawCardsMutation = withDrawCardsExistingDeckMutation.useMutation();
		const getShuffledDeckMutation = withGetShuffledDeckMutation.useMutation();

		return (
			<Container
				ui={{
					height: "viewport",
					width: "viewport",
				}}
			>
				<Container
					ui={{
						layout: "vertical-centered",
						width: "full",
						height: "full",
					}}
				>
					<SnapGame
						deckId={deck.deck_id}
						initialRemaining={deck.remaining}
						onDrawCard={async () => {
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

							return {
								card,
								remaining: result.remaining,
							};
						}}
						onReset={async () => {
							const nextDeck = await getShuffledDeckMutation.mutateAsync({
								query: {
									deck_count: 1,
								},
							});

							setDeck(nextDeck);
						}}
					/>
				</Container>
			</Container>
		);
	},
});
