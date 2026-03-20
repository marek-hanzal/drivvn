import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { drawFromPileBottom } from "../../api/client/sdk.gen";
import type {
	tDrawFromPileBottomRequest,
	tDrawFromPileBottomResponse,
} from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tDrawFromPileBottomMutation = Omit<tDrawFromPileBottomRequest, "url">;
export type tDrawFromPileBottomMutationResponse = tSuccessResponse<
	tDrawFromPileBottomResponse[200]
>;
export type tDrawFromPileBottomMutationError = tErrorResponse<tDrawFromPileBottomResponse[200]>;

export const withDrawFromPileBottomMutation = withMutation<
	tDrawFromPileBottomMutation,
	tDrawFromPileBottomMutationResponse,
	tDrawFromPileBottomMutationError
>({
	keys(variables) {
		return [
			"pile",
			"draw",
			"bottom",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(drawFromPileBottom(variables)).then(withSuccess);
	},
	invalidate: [],
});
