import { withQuery } from "@use-pico/client/query";
import { drawCardsNewDeck } from "../../api/client/sdk.gen";
import type {
	tDrawCardsNewDeckRequest,
	tDrawCardsNewDeckResponse,
} from "../../api/client/types.gen";

export type tDrawCardsNewDeckQuery = Omit<tDrawCardsNewDeckRequest, "url">;

export const withDrawCardsNewDeckQuery = withQuery<
	tDrawCardsNewDeckQuery | undefined,
	tDrawCardsNewDeckResponse[200]
>({
	keys(variables) {
		return [
			"deck",
			"new",
			"draw",
			variables,
		];
	},
	async queryFn(variables) {
		return drawCardsNewDeck({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
