import { withQuery } from "@use-pico/client/query";
import { getUnshuffledDeck } from "../../api/client/sdk.gen";
import type {
	tGetUnshuffledDeckRequest,
	tGetUnshuffledDeckResponse,
} from "../../api/client/types.gen";

export type tGetUnshuffledDeckQuery = Omit<tGetUnshuffledDeckRequest, "url">;

export const withGetUnshuffledDeckQuery = withQuery<
	tGetUnshuffledDeckQuery | undefined,
	tGetUnshuffledDeckResponse[200]
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
		}).then((res) => res.data);
	},
});
