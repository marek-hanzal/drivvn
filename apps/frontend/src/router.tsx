import { client as drivvnClient } from "@drivvn/sdk/api/client";
import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { routeTree } from "./_route";

export async function getRouter() {
	drivvnClient.setConfig({
		baseURL: "https://deckofcardsapi.com/api",
	});

	const staleTime = 5 * 60 * 1_000;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				placeholderData: keepPreviousData,
				staleTime,
				gcTime: staleTime * 2,
				refetchOnWindowFocus: true,
				refetchOnReconnect: true,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: {
			queryClient,
		},
		defaultPreload: "intent",
		defaultNotFoundComponent() {
			return (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<div>4😞4</div>
				</Container>
			);
		},
		defaultPendingComponent() {
			return (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<SpinnerContainer />
				</Container>
			);
		},
		defaultPendingMs: 100,
		scrollRestoration: true,
		//
		defaultViewTransition: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		wrapQueryClient: true,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
