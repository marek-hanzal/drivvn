import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { getUnshuffledDeck } from "../../api/client/sdk.gen";
import type {
	tGetUnshuffledDeckRequest,
	tGetUnshuffledDeckResponse,
} from "../../api/client/types.gen";
import type { tErrorResponse, tSuccessResponse } from "../_shared";
import { withSuccess } from "../_shared";

export type tGetUnshuffledDeckMutation = Omit<tGetUnshuffledDeckRequest, "url">;
export type tGetUnshuffledDeckMutationResponse = tSuccessResponse<tGetUnshuffledDeckResponse[200]>;
export type tGetUnshuffledDeckMutationError = tErrorResponse<tGetUnshuffledDeckResponse[200]>;

export const withGetUnshuffledDeckMutation = withMutation<
	tGetUnshuffledDeckMutation | undefined,
	tGetUnshuffledDeckMutationResponse,
	tGetUnshuffledDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"unshuffled",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(getUnshuffledDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
