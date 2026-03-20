import { withQuery } from "@use-pico/client/query";
import { reshuffleDeck } from "../../api/client/sdk.gen";
import type { tReshuffleDeckRequest, tReshuffleDeckResponse } from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tReshuffleDeckQuery = Omit<tReshuffleDeckRequest, "url">;

export const withReshuffleDeckQuery = withQuery<
	tReshuffleDeckQuery,
	tSuccessResponse<tReshuffleDeckResponse[200]>
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"shuffle",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"shuffle",
			variables,
		];
	},
	async queryFn(variables) {
		return reshuffleDeck({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
