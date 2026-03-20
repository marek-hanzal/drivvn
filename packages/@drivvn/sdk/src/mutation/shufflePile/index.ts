import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { shufflePile } from "../../api/client/sdk.gen";
import type { tShufflePileRequest, tShufflePileResponse } from "../../api/client/types.gen";
import type { tErrorResponse, tSuccessResponse } from "../_shared";
import { withSuccess } from "../_shared";

export type tShufflePileMutation = Omit<tShufflePileRequest, "url">;
export type tShufflePileMutationResponse = tSuccessResponse<tShufflePileResponse[200]>;
export type tShufflePileMutationError = tErrorResponse<tShufflePileResponse[200]>;

export const withShufflePileMutation = withMutation<
	tShufflePileMutation,
	tShufflePileMutationResponse,
	tShufflePileMutationError
>({
	keys(variables) {
		return [
			"pile",
			"shuffle",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(shufflePile(variables)).then(withSuccess);
	},
	invalidate: [],
});
