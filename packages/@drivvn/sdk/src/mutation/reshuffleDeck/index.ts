import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { reshuffleDeck } from "../../api/client/sdk.gen";
import type { tReshuffleDeckRequest, tReshuffleDeckResponse } from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tReshuffleDeckMutation = Omit<tReshuffleDeckRequest, "url">;
export type tReshuffleDeckMutationResponse = tSuccessResponse<tReshuffleDeckResponse[200]>;
export type tReshuffleDeckMutationError = tErrorResponse<tReshuffleDeckResponse[200]>;

export const withReshuffleDeckMutation = withMutation<
	tReshuffleDeckMutation,
	tReshuffleDeckMutationResponse,
	tReshuffleDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"shuffle",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(reshuffleDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
