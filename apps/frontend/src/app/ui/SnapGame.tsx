import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { FC } from "react";
import { useSnapGame } from "../hook/useSnapGame";
import { SnapCardSlot } from "./SnapCardSlot";

const PLACEHOLDER_ALT = "Card placeholder";

const toCardAlt = (value: string, suit: string) => {
	return `${value.toLowerCase()} of ${suit.toLowerCase()}`;
};

export const SnapGame: FC = () => {
	const {
		hasStarted,
		currentCard,
		previousCard,
		message,
		stats,
		progressLabel,
		nextSnapProbability,
		isComplete,
		isDrawing,
		isResetting,
		start,
		draw,
		reset,
	} = useSnapGame();

	if (!hasStarted) {
		return (
			<Status
				icon={"icon-[ph--cards-three-duotone]"}
				textTitle={"Snap Game!"}
				textMessage={"Draw through the deck and hunt for snap by value or suit."}
				ui={{
					theme: "light",
					tone: "secondary",
					round: "lg",
					inner: "4xl",
				}}
				action={
					<Button
						disabled={isDrawing}
						onClick={start}
						ui={{
							tone: "primary",
							theme: "light",
							size: "lg",
							text: "xl",
						}}
					>
						Start
					</Button>
				}
			/>
		);
	}

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
					layout: "vertical-centered",
					gap: "sm",
				}}
			>
				<div>{progressLabel}</div>
				<div>{`Next snap chance: ${(nextSnapProbability * 100).toFixed(1)}%`}</div>
				<div>{`Value matches: ${stats.valueMatches}`}</div>
				<div>{`Suit matches: ${stats.suitMatches}`}</div>
			</Container>

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
						previousCard
							? toCardAlt(previousCard.value, previousCard.suit)
							: PLACEHOLDER_ALT
					}
					label={"Previous"}
					src={previousCard?.image}
				/>

				<SnapCardSlot
					alt={
						currentCard
							? toCardAlt(currentCard.value, currentCard.suit)
							: PLACEHOLDER_ALT
					}
					label={"Current"}
					src={currentCard?.image}
				/>
			</Container>

			{message ? (
				<div className={"text-lg font-semibold tracking-[0.15em]"}>{message}</div>
			) : (
				<div
					aria-hidden={"true"}
					className={"h-7"}
				/>
			)}

			{isComplete ? (
				<Button
					disabled={isResetting}
					onClick={reset}
					ui={{
						tone: "secondary",
						theme: "light",
						size: "lg",
						text: "xl",
					}}
				>
					Reset
				</Button>
			) : (
				<Button
					disabled={isDrawing}
					onClick={draw}
					ui={{
						tone: "primary",
						theme: "light",
						size: "lg",
						text: "xl",
					}}
				>
					Draw card
				</Button>
			)}
		</Container>
	);
};
