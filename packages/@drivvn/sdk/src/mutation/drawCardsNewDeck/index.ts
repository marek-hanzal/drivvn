import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { drawCardsNewDeck } from "../../api/client/sdk.gen";
import type {
	tDrawCardsNewDeckRequest,
	tDrawCardsNewDeckResponse,
} from "../../api/client/types.gen";
import type { tErrorResponse, tSuccessResponse } from "../_shared";
import { withSuccess } from "../_shared";

export type tDrawCardsNewDeckMutation = Omit<tDrawCardsNewDeckRequest, "url">;
export type tDrawCardsNewDeckMutationResponse = tSuccessResponse<tDrawCardsNewDeckResponse[200]>;
export type tDrawCardsNewDeckMutationError = tErrorResponse<tDrawCardsNewDeckResponse[200]>;

export const withDrawCardsNewDeckMutation = withMutation<
	tDrawCardsNewDeckMutation | undefined,
	tDrawCardsNewDeckMutationResponse,
	tDrawCardsNewDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"new",
			"draw",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(drawCardsNewDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
