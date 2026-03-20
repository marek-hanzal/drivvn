import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { useSnapGame } from "../hook/useSnapGame";
import { SnapCardSlot } from "./SnapCardSlot";

const PLACEHOLDER_ALT = "Card placeholder";

const toCardAlt = (value: string, suit: string) => {
	return `${value.toLowerCase()} of ${suit.toLowerCase()}`;
};

export const SnapGame: FC = () => {
	const {
		currentCard,
		previousCard,
		message,
		stats,
		isComplete,
		isDrawing,
		isResetting,
		draw,
		reset,
	} = useSnapGame();

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

			<Container
				ui={{
					layout: "vertical-centered",
					gap: "sm",
				}}
			>
				<div>{`Value matches: ${stats.valueMatches}`}</div>
				<div>{`Suit matches: ${stats.suitMatches}`}</div>
			</Container>

			{isComplete ? (
				<Button
					disabled={isResetting}
					onClick={reset}
					ui={{
						tone: "secondary",
						theme: "light",
					}}
				>
					Reset
				</Button>
			) : (
				<Button
					disabled={isDrawing}
					onClick={draw}
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
