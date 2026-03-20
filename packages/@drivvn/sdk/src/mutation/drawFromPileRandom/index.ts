import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { drawFromPileRandom } from "../../api/client/sdk.gen";
import type {
	tDrawFromPileRandomRequest,
	tDrawFromPileRandomResponse,
} from "../../api/client/types.gen";
import { withSuccess } from "../_shared";
import type { tErrorResponse, tSuccessResponse } from "../_shared";

export type tDrawFromPileRandomMutation = Omit<tDrawFromPileRandomRequest, "url">;
export type tDrawFromPileRandomMutationResponse = tSuccessResponse<
	tDrawFromPileRandomResponse[200]
>;
export type tDrawFromPileRandomMutationError = tErrorResponse<tDrawFromPileRandomResponse[200]>;

export const withDrawFromPileRandomMutation = withMutation<
	tDrawFromPileRandomMutation,
	tDrawFromPileRandomMutationResponse,
	tDrawFromPileRandomMutationError
>({
	keys(variables) {
		return [
			"pile",
			"draw",
			"random",
			variables,
		];
	},
	async mutationFn(variables) {
		return withApi(drawFromPileRandom(variables)).then(withSuccess);
	},
	invalidate: [],
});
