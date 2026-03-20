import type { CountMap } from "./types";

export const incrementCountByKey = (map: CountMap, key: string): CountMap => {
	return {
		...map,
		[key]: (map[key] ?? 0) + 1,
	};
};
