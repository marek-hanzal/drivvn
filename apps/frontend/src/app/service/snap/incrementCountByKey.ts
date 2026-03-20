import type { CountMap } from "./types";

export namespace incrementCountByKey {
	export interface Props {
		map: CountMap;
		key: string;
	}
}

export const incrementCountByKey = ({ map, key }: incrementCountByKey.Props): CountMap => {
	return {
		...map,
		[key]: (map[key] ?? 0) + 1,
	};
};
