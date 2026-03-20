import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { getShuffledDeck } from "../../api/client/sdk.gen";
import type { tGetShuffledDeckRequest, tGetShuffledDeckResponse } from "../../api/client/types.gen";
import type { tErrorResponse, tSuccessResponse } from "../_shared";
import { withSuccess } from "../_shared";

export type tGetShuffledDeckMutation = Omit<tGetShuffledDeckRequest, "url">;
export type tGetShuffledDeckMutationResponse = tSuccessResponse<tGetShuffledDeckResponse[200]>;
export type tGetShuffledDeckMutationError = tErrorResponse<tGetShuffledDeckResponse[200]>;

export const withGetShuffledDeckMutation = withMutation<
	tGetShuffledDeckMutation | undefined,
	tGetShuffledDeckMutationResponse,
	tGetShuffledDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"shuffled",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(getShuffledDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
