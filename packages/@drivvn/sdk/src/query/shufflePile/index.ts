import { withQuery } from "@use-pico/client/query";
import { shufflePile } from "../../api/client/sdk.gen";
import type { tShufflePileRequest, tShufflePileResponse } from "../../api/client/types.gen";

export type tShufflePileQuery = Omit<tShufflePileRequest, "url">;

export const withShufflePileQuery = withQuery<tShufflePileQuery, tShufflePileResponse[200]>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"shuffle",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"shuffle",
			variables,
		];
	},
	async queryFn(variables) {
		return shufflePile({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
