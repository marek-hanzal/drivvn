import { Container } from "@use-pico/client/ui/container";
import type { CSSProperties, FC } from "react";
import { HeroImage } from "./HeroImage";
import { SnapCardSlot } from "./SnapCardSlot";

const CARD_BACK_SRC = "https://deckofcardsapi.com/static/img/back.png";
const MAX_VISIBLE_CARDS = 5;
const CARD_WIDTH_REM = 10;
const CARD_HEIGHT_REM = (CARD_WIDTH_REM * 88) / 63;
const STACK_STEP_REM = 1.5;
const STACK_LAYERS = [
	0,
	1,
	2,
	3,
	4,
];

export namespace CurrentDeckStack {
	export interface Props {
		alt: string;
		src?: string;
		remainingCount: number;
	}
}

export const CurrentDeckStack: FC<CurrentDeckStack.Props> = ({ alt, src, remainingCount }) => {
	const visibleCount = Math.min(remainingCount, MAX_VISIBLE_CARDS);
	const stackDepthRem = visibleCount > 0 ? visibleCount * STACK_STEP_REM : 0;

	return (
		<Container
			className={[
				"relative",
				"w-40",
				"shrink-0",
			]}
			style={{
				height: `${CARD_HEIGHT_REM}rem`,
				overflow: "visible",
			}}
		>
			{STACK_LAYERS.slice(0, visibleCount).map((layer) => {
				const style: CSSProperties = {
					position: "absolute",
					left: 0,
					top: `${-stackDepthRem + layer * STACK_STEP_REM}rem`,
					width: `${CARD_WIDTH_REM}rem`,
					height: `${CARD_HEIGHT_REM}rem`,
					zIndex: layer + 1,
				};

				return (
					<Container
						key={`deck-back-${layer}`}
						className={"rounded-[0.75rem] shadow-sm"}
						style={style}
					>
						<HeroImage
							alt={"Deck back"}
							src={CARD_BACK_SRC}
							ui={{
								width: "full",
								height: "full",
							}}
						/>
					</Container>
				);
			})}

			<Container
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: `${CARD_WIDTH_REM}rem`,
					zIndex: MAX_VISIBLE_CARDS + 1,
				}}
			>
				<SnapCardSlot
					alt={alt}
					src={src}
				/>
			</Container>
		</Container>
	);
};
