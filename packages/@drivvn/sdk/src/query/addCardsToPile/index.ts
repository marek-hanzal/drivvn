import { withQuery } from "@use-pico/client/query";
import { addCardsToPile } from "../../api/client/sdk.gen";
import type { tAddCardsToPileRequest, tAddCardsToPileResponse } from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tAddCardsToPileQuery = Omit<tAddCardsToPileRequest, "url">;

export const withAddCardsToPileQuery = withQuery<
	tAddCardsToPileQuery,
	tSuccessResponse<tAddCardsToPileResponse[200]>
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"add",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"add",
			variables,
		];
	},
	async queryFn(variables) {
		return addCardsToPile({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
