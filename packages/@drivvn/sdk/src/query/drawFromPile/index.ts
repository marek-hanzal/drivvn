import { withQuery } from "@use-pico/client/query";
import { drawFromPile } from "../../api/client/sdk.gen";
import type { tDrawFromPileRequest, tDrawFromPileResponse } from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tDrawFromPileQuery = Omit<tDrawFromPileRequest, "url">;

export const withDrawFromPileQuery = withQuery<
	tDrawFromPileQuery,
	tSuccessResponse<tDrawFromPileResponse[200]>
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"draw",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"draw",
			variables,
		];
	},
	async queryFn(variables) {
		return drawFromPile({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
