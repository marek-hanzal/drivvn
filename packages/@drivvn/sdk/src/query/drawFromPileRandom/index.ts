import { withQuery } from "@use-pico/client/query";
import { drawFromPileRandom } from "../../api/client/sdk.gen";
import type {
	tDrawFromPileRandomRequest,
	tDrawFromPileRandomResponse,
} from "../../api/client/types.gen";

export type tDrawFromPileRandomQuery = Omit<tDrawFromPileRandomRequest, "url">;

export const withDrawFromPileRandomQuery = withQuery<
	tDrawFromPileRandomQuery,
	tDrawFromPileRandomResponse[200]
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"draw",
				"random",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"draw",
			"random",
			variables,
		];
	},
	async queryFn(variables) {
		return drawFromPileRandom({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
