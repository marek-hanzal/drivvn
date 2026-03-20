import { withQuery } from "@use-pico/client/query";
import { returnCardsToPile } from "../../api/client/sdk.gen";
import type {
	tReturnCardsToPileRequest,
	tReturnCardsToPileResponse,
} from "../../api/client/types.gen";

export type tReturnCardsToPileQuery = Omit<tReturnCardsToPileRequest, "url">;

export const withReturnCardsToPileQuery = withQuery<
	tReturnCardsToPileQuery,
	tReturnCardsToPileResponse[200]
>({
	keys(variables) {
		if (!variables) {
			return [
				"deck",
				"pile",
				"return",
			];
		}

		return [
			"deck",
			variables.path.deck_id,
			"pile",
			variables.path.pile_name,
			"return",
			variables,
		];
	},
	async queryFn(variables) {
		return returnCardsToPile({
			...variables,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
