import { withQuery } from "@use-pico/client/query";
import { getUnshuffledDeck } from "../../api/client/sdk.gen";
import type {
	tGetUnshuffledDeckRequest,
	tGetUnshuffledDeckResponse,
} from "../../api/client/types.gen";
import { type tSuccessResponse, withSuccess } from "../../mutation/_shared";

export type tGetUnshuffledDeckQuery = Omit<tGetUnshuffledDeckRequest, "url">;

export const withGetUnshuffledDeckQuery = withQuery<
	tGetUnshuffledDeckQuery | undefined,
	tSuccessResponse<tGetUnshuffledDeckResponse[200]>
>({
	keys(variables) {
		return [
			"deck",
			"unshuffled",
			variables,
		];
	},
	async queryFn(variables) {
		return getUnshuffledDeck({
			...variables,
			throwOnError: true,
		})
			.then((res) => res.data)
			.then(withSuccess);
	},
});
