import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { drawCardsExistingDeck } from "../../api/client/sdk.gen";
import type {
	tDrawCardsExistingDeckRequest,
	tDrawCardsExistingDeckResponse,
} from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tDrawCardsExistingDeckMutation = Omit<tDrawCardsExistingDeckRequest, "url">;
export type tDrawCardsExistingDeckMutationResponse = tSuccessResponse<
	tDrawCardsExistingDeckResponse[200]
>;
export type tDrawCardsExistingDeckMutationError = tErrorResponse<
	tDrawCardsExistingDeckResponse[200]
>;

export const withDrawCardsExistingDeckMutation = withMutation<
	tDrawCardsExistingDeckMutation,
	tDrawCardsExistingDeckMutationResponse,
	tDrawCardsExistingDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"draw",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(drawCardsExistingDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
