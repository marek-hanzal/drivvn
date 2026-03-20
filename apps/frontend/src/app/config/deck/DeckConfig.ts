export interface DeckConfig {
	deckCount: number;
	totalCards: number;
	copiesPerValue: number;
	cardsPerSuit: number;
}

export namespace createStandardDeckConfig {
	export interface Props {
		deckCount: number;
	}
}

export const createStandardDeckConfig = ({
	deckCount,
}: createStandardDeckConfig.Props): DeckConfig => {
	return {
		deckCount,
		totalCards: 52 * deckCount,
		copiesPerValue: 4 * deckCount,
		cardsPerSuit: 13 * deckCount,
	};
};

export const snapDeckConfig = createStandardDeckConfig({
	deckCount: 1,
});
