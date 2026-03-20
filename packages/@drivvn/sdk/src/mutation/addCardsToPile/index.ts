import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { addCardsToPile } from "../../api/client/sdk.gen";
import type { tAddCardsToPileRequest, tAddCardsToPileResponse } from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tAddCardsToPileMutation = Omit<tAddCardsToPileRequest, "url">;
export type tAddCardsToPileMutationResponse = tSuccessResponse<tAddCardsToPileResponse[200]>;
export type tAddCardsToPileMutationError = tErrorResponse<tAddCardsToPileResponse[200]>;

export const withAddCardsToPileMutation = withMutation<
	tAddCardsToPileMutation,
	tAddCardsToPileMutationResponse,
	tAddCardsToPileMutationError
>({
	keys(variables) {
		return [
			"pile",
			"add",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(addCardsToPile(variables)).then(withSuccess);
	},
	invalidate: [],
});
