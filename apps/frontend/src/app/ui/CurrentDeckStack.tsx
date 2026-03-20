import { Container } from "@use-pico/client/ui/container";
import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties, FC } from "react";
import { HeroImage } from "./HeroImage";
import { SnapCardSlot } from "./SnapCardSlot";

const CARD_BACK_SRC = "https://deckofcardsapi.com/static/img/back.png";
const MAX_VISIBLE_CARDS = 5;
export const SNAP_CARD_WIDTH_REM = 10;
export const SNAP_CARD_HEIGHT_REM = (SNAP_CARD_WIDTH_REM * 88) / 63;
const STACK_STEP_REM = 1.5;
export const SNAP_STACK_OFFSET_REM = MAX_VISIBLE_CARDS * STACK_STEP_REM;
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
		cardKey?: string;
		isAnimating?: boolean;
		src?: string;
		remainingCount: number;
	}
}

const cardTransition = {
	type: "spring",
	stiffness: 320,
	damping: 24,
	mass: 0.9,
} as const;

export const CurrentDeckStack: FC<CurrentDeckStack.Props> = ({
	alt,
	cardKey,
	isAnimating = false,
	src,
	remainingCount,
}) => {
	const visibleCount = Math.min(remainingCount, MAX_VISIBLE_CARDS);
	const stackStartRem = SNAP_STACK_OFFSET_REM - visibleCount * STACK_STEP_REM;

	return (
		<Container
			className={[
				"relative",
				"w-40",
				"shrink-0",
			]}
			style={{
				height: `${SNAP_CARD_HEIGHT_REM + SNAP_STACK_OFFSET_REM}rem`,
			}}
		>
			<AnimatePresence initial={false}>
				{STACK_LAYERS.slice(0, visibleCount).map((layer) => {
					const style: CSSProperties = {
						position: "absolute",
						left: 0,
						top: `${stackStartRem + layer * STACK_STEP_REM}rem`,
						width: `${SNAP_CARD_WIDTH_REM}rem`,
						height: `${SNAP_CARD_HEIGHT_REM}rem`,
						zIndex: layer + 1,
					};

					return (
						<motion.div
							key={`deck-back-${layer}`}
							animate={{
								scale: isAnimating ? 0.985 : 1,
								y: isAnimating ? -10 : 0,
							}}
							className={"rounded-[0.75rem] shadow-sm"}
							exit={{
								opacity: 0,
								scale: 0.96,
								y: -16,
							}}
							initial={{
								opacity: 0,
								scale: 0.94,
								y: 20,
							}}
							layout
							style={style}
							transition={cardTransition}
						>
							<HeroImage
								alt={"Deck back"}
								src={CARD_BACK_SRC}
								ui={{
									width: "full",
									height: "full",
								}}
							/>
						</motion.div>
					);
				})}
			</AnimatePresence>

			<AnimatePresence initial={false}>
				<motion.div
					key={cardKey ?? src ?? "card-placeholder"}
					animate={{
						opacity: 1,
						rotate: 0,
						scale: 1,
						x: 0,
						y: 0,
					}}
					exit={{
						opacity: 0,
						rotate: 4,
						scale: 0.96,
						x: -36,
					}}
					initial={{
						opacity: 0,
						rotate: 6,
						scale: 0.96,
						x: 36,
						y: 0,
					}}
					layout
					layoutId={cardKey ? `snap-card-${cardKey}` : undefined}
					style={{
						position: "absolute",
						left: 0,
						top: `${SNAP_STACK_OFFSET_REM}rem`,
						width: `${SNAP_CARD_WIDTH_REM}rem`,
						zIndex: MAX_VISIBLE_CARDS + 1,
					}}
					transition={cardTransition}
				>
					<SnapCardSlot
						alt={alt}
						src={src}
					/>
				</motion.div>
			</AnimatePresence>
		</Container>
	);
};
