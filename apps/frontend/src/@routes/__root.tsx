import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import styles from "~/assets/style.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "The Card Quest",
			},
			{
				name: "referrer",
				content: "strict-origin-when-cross-origin",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: styles,
				type: "text/css",
			},
		],
	}),
	shellComponent() {
		return (
			<html className={"[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}>
				<head>
					<HeadContent />
				</head>

				<body>
					<Outlet />

					<Scripts />
				</body>
			</html>
		);
	},
});
