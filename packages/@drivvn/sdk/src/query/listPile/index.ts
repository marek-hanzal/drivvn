import { withQuery } from "@use-pico/client/query";
import { listPile } from "../../api/client/sdk.gen";
import type { tListPileRequest, tListPileResponse } from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tListPileQuery = Omit<tListPileRequest, "url">;

export const withListPileQuery = withQuery<
	tListPileQuery,
	tSuccessResponse<tListPileResponse[200]>
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"list",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"list",
			variables,
		];
	},
	async queryFn(variables) {
		return listPile({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
