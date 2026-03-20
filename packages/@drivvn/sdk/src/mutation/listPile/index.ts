import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { listPile } from "../../api/client/sdk.gen";
import type { tListPileRequest, tListPileResponse } from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tListPileMutation = Omit<tListPileRequest, "url">;
export type tListPileMutationResponse = tSuccessResponse<tListPileResponse[200]>;
export type tListPileMutationError = tErrorResponse<tListPileResponse[200]>;

export const withListPileMutation = withMutation<
	tListPileMutation,
	tListPileMutationResponse,
	tListPileMutationError
>({
	keys(variables) {
		return [
			"pile",
			"list",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(listPile(variables)).then(withSuccess);
	},
	invalidate: [],
});
