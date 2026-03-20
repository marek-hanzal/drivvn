import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { returnCardsToPile } from "../../api/client/sdk.gen";
import type {
	tReturnCardsToPileRequest,
	tReturnCardsToPileResponse,
} from "../../api/client/types.gen";
import type { tErrorResponse, tSuccessResponse } from "../_shared";
import { withSuccess } from "../_shared";

export type tReturnCardsToPileMutation = Omit<tReturnCardsToPileRequest, "url">;
export type tReturnCardsToPileMutationResponse = tSuccessResponse<tReturnCardsToPileResponse[200]>;
export type tReturnCardsToPileMutationError = tErrorResponse<tReturnCardsToPileResponse[200]>;

export const withReturnCardsToPileMutation = withMutation<
	tReturnCardsToPileMutation,
	tReturnCardsToPileMutationResponse,
	tReturnCardsToPileMutationError
>({
	keys(variables) {
		return [
			"pile",
			"return",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(returnCardsToPile(variables)).then(withSuccess);
	},
	invalidate: [],
});
