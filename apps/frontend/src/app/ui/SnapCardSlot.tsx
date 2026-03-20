import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { HeroImage } from "./HeroImage";

export namespace SnapCardSlot {
	export interface Props {
		alt: string;
		src?: string;
	}
}

export const SnapCardSlot: FC<SnapCardSlot.Props> = ({ alt, src }) => {
	return (
		<Container
			data-ui={"Card"}
			className={[
				"aspect-63/88",
				"w-40",
				"shrink-0",
				"overflow-hidden",
			]}
		>
			{src ? (
				<HeroImage
					alt={alt}
					src={src}
					ui={{
						width: "full",
						height: "full",
					}}
				/>
			) : (
				<Container
					ui={{
						layout: "vertical-centered",
						width: "full",
						height: "full",
					}}
					className={[
						"bg-neutral-100",
					]}
				>
					{/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: Placeholder slot needs a stable accessible label for tests and screen readers. */}
					<span aria-label={alt} />
				</Container>
			)}
		</Container>
	);
};
