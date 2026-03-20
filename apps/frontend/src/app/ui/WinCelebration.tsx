import { motion } from "motion/react";
import { type FC, useMemo } from "react";
import { SNAP_CARD_HEIGHT_REM, SNAP_CARD_WIDTH_REM } from "./CurrentDeckStack";

const CARD_BACK_SRC = "https://deckofcardsapi.com/static/img/back.png";
const CARD_COUNT = 44;

const pseudo = (seed: number) => {
	const value = Math.sin(seed * 12.9898) * 43758.5453;

	return value - Math.floor(value);
};

const createCelebrationCards = (viewportHeight: number, viewportWidth: number) => {
	return Array.from({
		length: CARD_COUNT,
	}).map((_, index) => {
		const leftBias = pseudo(index + 1);
		const arcBias = pseudo(index + 11);
		const fallBias = pseudo(index + 21);
		const spinBias = pseudo(index + 31);
		const laneBias = pseudo(index + 41);
		const launchX = viewportWidth * (0.74 + laneBias * 0.06);
		const apexX = launchX - viewportWidth * (0.14 + leftBias * 0.48);
		const landingX =
			apexX + viewportWidth * (-0.1 + pseudo(index + 51) * 0.9) - viewportWidth * 0.18;
		const apexY = 50 + arcBias * 180;
		const midY = viewportHeight * (0.36 + fallBias * 0.18);
		const finalY = viewportHeight + 220 + (index % 5) * 70;
		const rotateStart = -8 + spinBias * 16;
		const rotateMid = rotateStart + (-30 + pseudo(index + 61) * 60);
		const rotateEnd = rotateMid + (-24 + pseudo(index + 71) * 48);

		return {
			delay: index * 0.045,
			id: `celebration-card-${index}`,
			launchX,
			apexX,
			landingX,
			apexY,
			midY,
			finalY,
			rotateStart,
			rotateMid,
			rotateEnd,
		};
	});
};

export namespace WinCelebration {
	export interface Props {
		onSkip(): void;
	}
}

export const WinCelebration: FC<WinCelebration.Props> = ({ onSkip }) => {
	const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
	const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
	const cards = useMemo(() => {
		return createCelebrationCards(viewportHeight, viewportWidth);
	}, [
		viewportHeight,
		viewportWidth,
	]);

	return (
		<button
			type={"button"}
			aria-label={"Solitaire celebration"}
			className={[
				"fixed inset-0 z-50 overflow-hidden bg-white/72 backdrop-blur-[1px]",
				"border-0 p-0 text-left",
			].join(" ")}
			onClick={onSkip}
		>
			<div className={"pointer-events-none absolute inset-0"}>
				{cards.map((card) => (
					<motion.img
						key={card.id}
						alt={""}
						animate={{
							opacity: [
								0,
								1,
								1,
								1,
							],
							rotate: [
								card.rotateStart,
								card.rotateMid,
								card.rotateMid * 0.55,
								card.rotateEnd,
							],
							x: [
								0,
								card.apexX - card.launchX,
								(card.apexX + card.landingX) / 2 - card.launchX,
								card.landingX - card.launchX,
							],
							y: [
								-220,
								card.apexY,
								card.midY,
								card.finalY,
							],
						}}
						className={"absolute rounded-[0.75rem] shadow-xl select-none"}
						draggable={false}
						initial={{
							opacity: 0,
							rotate: card.rotateStart,
							x: 0,
							y: -220,
						}}
						src={CARD_BACK_SRC}
						style={{
							left: `${card.launchX}px`,
							top: 0,
							width: `${SNAP_CARD_WIDTH_REM}rem`,
							height: `${SNAP_CARD_HEIGHT_REM}rem`,
						}}
						transition={{
							delay: card.delay,
							duration: 2.9,
							ease: "linear",
							times: [
								0,
								0.16,
								0.48,
								1,
							],
						}}
					/>
				))}
			</div>

			<motion.div
				animate={{
					opacity: 1,
					scale: 1,
					y: 0,
				}}
				className={
					"absolute right-8 bottom-8 text-right text-sm tracking-[0.2em] text-neutral-500 uppercase"
				}
				initial={{
					opacity: 0,
					scale: 0.98,
					y: 8,
				}}
				transition={{
					delay: 0.2,
					duration: 0.24,
					ease: "easeOut",
				}}
			>
				Click anywhere to skip
			</motion.div>
		</button>
	);
};
