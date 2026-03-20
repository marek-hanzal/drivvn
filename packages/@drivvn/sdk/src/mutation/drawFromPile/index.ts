import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { drawFromPile } from "../../api/client/sdk.gen";
import type { tDrawFromPileRequest, tDrawFromPileResponse } from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tDrawFromPileMutation = Omit<tDrawFromPileRequest, "url">;
export type tDrawFromPileMutationResponse = tSuccessResponse<tDrawFromPileResponse[200]>;
export type tDrawFromPileMutationError = tErrorResponse<tDrawFromPileResponse[200]>;

export const withDrawFromPileMutation = withMutation<
	tDrawFromPileMutation,
	tDrawFromPileMutationResponse,
	tDrawFromPileMutationError
>({
	keys(variables) {
		return [
			"pile",
			"draw",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(drawFromPile(variables)).then(withSuccess);
	},
	invalidate: [],
});
