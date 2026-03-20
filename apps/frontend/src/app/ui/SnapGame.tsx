import type { tRemaining } from "@drivvn/sdk/api/client";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { type FC, startTransition, useEffect, useState } from "react";
import { applyDrawResult } from "../service/snap/applyDrawResult";
import { createInitialSnapState } from "../service/snap/createInitialSnapState";
import { isDeckComplete } from "../service/snap/isDeckComplete";
import type { DrawResult } from "../service/snap/types";
import { SnapCardSlot } from "./SnapCardSlot";

export namespace SnapGame {
	export interface Props {
		deckId: string;
		initialRemaining: tRemaining;
		onDrawCard: () => Promise<DrawResult>;
		onReset: () => Promise<void>;
	}
}

const PLACEHOLDER_ALT = "Card placeholder";

const toCardAlt = (value: string, suit: string) => {
	return `${value.toLowerCase()} of ${suit.toLowerCase()}`;
};

export const SnapGame: FC<SnapGame.Props> = ({ deckId, initialRemaining, onDrawCard, onReset }) => {
	const [state, setState] = useState(() => createInitialSnapState(initialRemaining));
	const [isDrawing, setIsDrawing] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	/* biome-ignore lint/correctness/useExhaustiveDependencies: deckId intentionally resets local game state when a brand-new shuffled deck is mounted. */
	useEffect(() => {
		setState(createInitialSnapState(initialRemaining));
	}, [
		deckId,
		initialRemaining,
	]);

	const onDraw = async () => {
		setIsDrawing(true);

		try {
			const result = await onDrawCard();

			startTransition(() => {
				setState((current) => applyDrawResult(current, result));
			});
		} finally {
			setIsDrawing(false);
		}
	};

	const onResetClick = async () => {
		setIsResetting(true);

		try {
			await onReset();
		} finally {
			setIsResetting(false);
		}
	};

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				width: "full",
				height: "full",
				gap: "4xl",
			}}
		>
			<Container
				ui={{
					flow: "horizontal",
					items: "start",
					gap: "4xl",
				}}
				className={[
					"w-fit",
					"max-w-full",
				]}
			>
				<SnapCardSlot
					alt={
						state.previousCard
							? toCardAlt(state.previousCard.value, state.previousCard.suit)
							: PLACEHOLDER_ALT
					}
					label={"Previous"}
					src={state.previousCard?.image}
				/>

				<SnapCardSlot
					alt={
						state.currentCard
							? toCardAlt(state.currentCard.value, state.currentCard.suit)
							: PLACEHOLDER_ALT
					}
					label={"Current"}
					src={state.currentCard?.image}
				/>
			</Container>

			{state.message ? (
				<div className={"text-lg font-semibold tracking-[0.15em]"}>{state.message}</div>
			) : (
				<div
					aria-hidden={"true"}
					className={"h-7"}
				/>
			)}

			{isDeckComplete(state) ? (
				<Container
					ui={{
						layout: "vertical-centered",
						gap: "sm",
					}}
				>
					<div>{`Value matches: ${state.valueMatches}`}</div>
					<div>{`Suit matches: ${state.suitMatches}`}</div>
					<Button
						disabled={isResetting}
						onClick={onResetClick}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					>
						Reset
					</Button>
				</Container>
			) : (
				<Button
					disabled={isDrawing}
					onClick={onDraw}
					ui={{
						tone: "secondary",
						theme: "light",
					}}
				>
					Draw card
				</Button>
			)}
		</Container>
	);
};
