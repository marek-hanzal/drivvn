import { withQuery } from "@use-pico/client/query";
import { drawCardsExistingDeck } from "../../api/client/sdk.gen";
import type {
	tDrawCardsExistingDeckRequest,
	tDrawCardsExistingDeckResponse,
} from "../../api/client/types.gen";

export type tDrawCardsExistingDeckQuery = Omit<tDrawCardsExistingDeckRequest, "url">;

export const withDrawCardsExistingDeckQuery = withQuery<
	tDrawCardsExistingDeckQuery,
	tDrawCardsExistingDeckResponse[200]
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"draw",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"draw",
			variables,
		];
	},
	async queryFn(variables) {
		return drawCardsExistingDeck({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
