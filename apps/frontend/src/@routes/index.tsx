import { createFileRoute } from "@tanstack/react-router";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Suspense } from "react";
import { SnapGame } from "~/app/ui/SnapGame";

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
					}}
				>
					<Suspense fallback={<SpinnerContainer />}>
						<SnapGame />
					</Suspense>
				</Container>
			</Container>
		);
	},
});
