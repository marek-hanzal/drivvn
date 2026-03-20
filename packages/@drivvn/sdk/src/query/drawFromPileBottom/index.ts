import { withQuery } from "@use-pico/client/query";
import { drawFromPileBottom } from "../../api/client/sdk.gen";
import type {
	tDrawFromPileBottomRequest,
	tDrawFromPileBottomResponse,
} from "../../api/client/types.gen";

export type tDrawFromPileBottomQuery = Omit<tDrawFromPileBottomRequest, "url">;

export const withDrawFromPileBottomQuery = withQuery<
	tDrawFromPileBottomQuery,
	tDrawFromPileBottomResponse[200]
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"draw",
				"bottom",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"draw",
			"bottom",
			variables,
		];
	},
	async queryFn(variables) {
		return drawFromPileBottom({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
