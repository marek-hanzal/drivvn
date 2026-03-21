import { motion } from "motion/react";
import { type FC, useMemo } from "react";
import { SNAP_CARD_HEIGHT_REM, SNAP_CARD_WIDTH_REM } from "./CurrentDeckStack";

const CARD_BACK_SRC = "https://deckofcardsapi.com/static/img/back.png";
const FACE_CARD_SRCS = [
	"https://deckofcardsapi.com/static/img/AS.png",
	"https://deckofcardsapi.com/static/img/KH.png",
	"https://deckofcardsapi.com/static/img/QD.png",
	"https://deckofcardsapi.com/static/img/JC.png",
	"https://deckofcardsapi.com/static/img/0S.png",
	"https://deckofcardsapi.com/static/img/9H.png",
	"https://deckofcardsapi.com/static/img/8D.png",
	"https://deckofcardsapi.com/static/img/7C.png",
];
const BASE_CARD_COUNT = 24;
const CARDS_PER_SUIT_MATCH = 3;
const CARDS_PER_VALUE_MATCH = 6;
const MAX_CARD_COUNT = 104;

const pseudo = (seed: number) => {
	const value = Math.sin(seed * 12.9898) * 43758.5453;

	return value - Math.floor(value);
};

const createCelebrationCards = (
	viewportHeight: number,
	viewportWidth: number,
	cardCount: number,
) => {
	return Array.from({
		length: cardCount,
	}).map((_, index) => {
		const wave = index % 2;
		const order = Math.floor(index / 2);
		const leftBias = pseudo(index + 1);
		const arcBias = pseudo(index + 11);
		const fallBias = pseudo(index + 21);
		const spinBias = pseudo(index + 31);
		const laneBias = pseudo(index + 41);
		const launchX = viewportWidth * (0.775 + wave * 0.028 + laneBias * 0.02);
		const apexX = launchX - viewportWidth * (0.14 + leftBias * 0.48);
		const landingX =
			apexX + viewportWidth * (-0.16 + pseudo(index + 51) * 0.95) - viewportWidth * 0.2;
		const apexY = 40 + arcBias * 170 + wave * 12;
		const midY = viewportHeight * (0.34 + fallBias * 0.2);
		const finalY = viewportHeight + 220 + (index % 5) * 70;
		const rotateStart = -8 + spinBias * 16;
		const rotateMid = rotateStart + (-30 + pseudo(index + 61) * 60);
		const rotateEnd = rotateMid + (-24 + pseudo(index + 71) * 48);
		const fadeStart = 0.18 + pseudo(index + 81) * 0.12;
		const fadeEnd = Math.min(0.56, fadeStart + 0.1 + pseudo(index + 91) * 0.08);

		return {
			delay: order * 0.032 + wave * 0.12,
			id: `celebration-card-${index}`,
			launchX,
			apexX,
			landingX,
			apexY,
			midY,
			finalY,
			src: index % 5 === 0 ? FACE_CARD_SRCS[index % FACE_CARD_SRCS.length] : CARD_BACK_SRC,
			rotateStart,
			rotateMid,
			rotateEnd,
			fadeStart,
			fadeEnd,
		};
	});
};

export namespace WinCelebration {
	export interface Props {
		onSkip(): void;
		suitMatches: number;
		valueMatches: number;
	}
}

export const WinCelebration: FC<WinCelebration.Props> = ({ onSkip, suitMatches, valueMatches }) => {
	const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
	const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
	const cardCount = Math.min(
		MAX_CARD_COUNT,
		BASE_CARD_COUNT + suitMatches * CARDS_PER_SUIT_MATCH + valueMatches * CARDS_PER_VALUE_MATCH,
	);
	const cards = useMemo(() => {
		return createCelebrationCards(viewportHeight, viewportWidth, cardCount);
	}, [
		cardCount,
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
			data-card-count={cardCount}
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
								0.55,
								0.14,
								0,
							],
							rotate: [
								card.rotateStart,
								card.rotateMid,
								card.rotateMid * 0.55,
								card.rotateEnd,
								card.rotateEnd * 1.1,
								card.rotateEnd * 1.18,
							],
							x: [
								0,
								card.apexX - card.launchX,
								(card.apexX + card.landingX) / 2 - card.launchX,
								card.landingX - card.launchX,
								card.landingX - card.launchX + 10,
								card.landingX - card.launchX + 18,
							],
							y: [
								-220,
								card.apexY,
								card.midY,
								card.finalY,
								card.finalY + 8,
								card.finalY + 16,
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
						src={card.src}
						style={{
							left: `${card.launchX}px`,
							top: 0,
							width: `${SNAP_CARD_WIDTH_REM}rem`,
							height: `${SNAP_CARD_HEIGHT_REM}rem`,
						}}
						transition={{
							delay: card.delay,
							duration: 3.2,
							ease: "linear",
							times: [
								0,
								0.12,
								card.fadeStart,
								card.fadeEnd,
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
