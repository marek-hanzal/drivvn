import { withQuery } from "@use-pico/client/query";
import { returnCardsToDeck } from "../../api/client/sdk.gen";
import type {
	tReturnCardsToDeckRequest,
	tReturnCardsToDeckResponse,
} from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tReturnCardsToDeckQuery = Omit<tReturnCardsToDeckRequest, "url">;

export const withReturnCardsToDeckQuery = withQuery<
	tReturnCardsToDeckQuery,
	tSuccessResponse<tReturnCardsToDeckResponse[200]>
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"return",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"return",
			variables,
		];
	},
	async queryFn(variables) {
		return returnCardsToDeck({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
