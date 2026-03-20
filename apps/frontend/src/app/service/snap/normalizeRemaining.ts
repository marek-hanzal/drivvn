import type { tRemaining } from "@drivvn/sdk/api/client";

export const normalizeRemaining = (remaining: tRemaining) => {
	return Number(remaining);
};
