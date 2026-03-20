import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { returnCardsToDeck } from "../../api/client/sdk.gen";
import type {
	tReturnCardsToDeckRequest,
	tReturnCardsToDeckResponse,
} from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tReturnCardsToDeckMutation = Omit<tReturnCardsToDeckRequest, "url">;
export type tReturnCardsToDeckMutationResponse = tSuccessResponse<tReturnCardsToDeckResponse[200]>;
export type tReturnCardsToDeckMutationError = tErrorResponse<tReturnCardsToDeckResponse[200]>;

export const withReturnCardsToDeckMutation = withMutation<
	tReturnCardsToDeckMutation,
	tReturnCardsToDeckMutationResponse,
	tReturnCardsToDeckMutationError
>({
	keys(variables) {
		return [
			"deck",
			"return",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(returnCardsToDeck(variables)).then(withSuccess);
	},
	invalidate: [],
});
