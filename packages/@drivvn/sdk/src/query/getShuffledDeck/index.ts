import { withQuery } from "@use-pico/client/query";
import { getShuffledDeck } from "../../api/client/sdk.gen";
import type { tGetShuffledDeckRequest, tGetShuffledDeckResponse } from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tGetShuffledDeckQuery = Omit<tGetShuffledDeckRequest, "url">;

export const withGetShuffledDeckQuery = withQuery<
	tGetShuffledDeckQuery | undefined,
	tSuccessResponse<tGetShuffledDeckResponse[200]>
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
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
