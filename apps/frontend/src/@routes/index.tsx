import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";

export const Route = createFileRoute("/")({
	component() {
		return (
			<Container
				ui={{
					height: "viewport",
					width: "viewport",
				}}
			>
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
						<Container
							data-ui={"Card"}
							ui={{
								tone: "secondary",
								theme: "light",
								background: "default",
								shadow: true,
								border: true,
								round: "default",
							}}
							className={[
								"aspect-63/88",
								"w-40",
								"shrink-0",
							]}
						>
							A
						</Container>

						<Container
							data-ui={"Card"}
							ui={{
								tone: "secondary",
								theme: "light",
								background: "default",
								shadow: true,
								border: true,
								round: "default",
							}}
							className={[
								"aspect-63/88",
								"w-40",
								"shrink-0",
							]}
						>
							B
						</Container>
					</Container>

					<Button
						ui={{
							tone: "primary",
							theme: "light",
							inner: "2xl",
						}}
					>
						The Button
					</Button>
				</Container>
			</Container>
		);
	},
});
