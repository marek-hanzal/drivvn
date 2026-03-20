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
		phase,
		currentCard,
		previousCard,
		message,
		totalCards,
		drawnCount,
		stats,
		nextSnapProbability,
		start,
		draw,
		reset,
		startFresh,
	} = useSnapGame();

	if (phase === "idle" || phase === "starting") {
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
						disabled={phase === "starting"}
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

	if (phase === "completed" || phase === "resetting" || phase === "refreshing") {
		return (
			<Status
				icon={"icon-[ph--seal-warning-duotone]"}
				textTitle={"Game over"}
				textMessage={`Value matches: ${stats.valueMatches} | Suit matches: ${stats.suitMatches}`}
				ui={{
					theme: "light",
					tone: "secondary",
					round: "lg",
					inner: "4xl",
				}}
				action={
					<Container
						ui={{
							flow: "horizontal",
							gap: "md",
						}}
					>
						<Button
							disabled={phase === "resetting" || phase === "refreshing"}
							onClick={reset}
							ui={{
								tone: "secondary",
								theme: "light",
								size: "lg",
								text: "xl",
							}}
						>
							Reset game
						</Button>

						<Button
							disabled={phase === "resetting" || phase === "refreshing"}
							onClick={startFresh}
							ui={{
								tone: "neutral",
								theme: "light",
								size: "lg",
								text: "xl",
							}}
						>
							Start fresh
						</Button>
					</Container>
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
				<div>{`Card ${drawnCount} of ${totalCards}`}</div>
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
					src={previousCard?.image}
				/>

				<SnapCardSlot
					alt={
						currentCard
							? toCardAlt(currentCard.value, currentCard.suit)
							: PLACEHOLDER_ALT
					}
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

			<Button
				disabled={phase === "drawing"}
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
		</Container>
	);
};
