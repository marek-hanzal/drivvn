import { withQuery } from "@use-pico/client/query";
import { getShuffledDeck } from "../../api/client/sdk.gen";
import type { tGetShuffledDeckRequest, tGetShuffledDeckResponse } from "../../api/client/types.gen";

export type tGetShuffledDeckQuery = Omit<tGetShuffledDeckRequest, "url">;

export const withGetShuffledDeckQuery = withQuery<
	tGetShuffledDeckQuery | undefined,
	tGetShuffledDeckResponse[200]
>({
	keys(variables) {
		return [
			"deck",
			"shuffled",
			variables,
		];
	},
	async queryFn(variables) {
		return getShuffledDeck({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
