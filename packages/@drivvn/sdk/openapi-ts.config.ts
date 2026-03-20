import { defineConfig } from "@hey-api/openapi-ts";

const output = {
	path: "src/api/client",
	postProcess: ["biome:lint", "biome:format"],
} as const;

export default defineConfig({
	input: "openapi.yaml",
	output,
	plugins: [
		{
			name: "@hey-api/client-axios",
			exportFromIndex: true,
			baseUrl: false,
		},
		{
			name: "zod",
			requests: {
				types: {
					infer: {
						name: "z{{name}}Request",
					},
				},
			},
			responses: {
				types: {
					infer: {
						name: "z{{name}}Response",
					},
				},
			},
			metadata: true,
			definitions: {
				types: {
					infer: {
						name: "z{{name}}",
					},
				},
			},
			comments: true,
			compatibilityVersion: 4,
			dates: {
				local: false,
				offset: false,
			},
			types: {
				infer: {
					case: "preserve",
				},
			},
			exportFromIndex: true,
		},
		{
			name: "@hey-api/typescript",
			validator: true,
			baseUrl: false,
			case: "camelCase",
			requests: {
				name: "t{{name}}Request",
			},
			responses: {
				name: "t{{name}}Response",
			},
			definitions: {
				name: "t{{name}}",
			},
			enums: {
				case: "preserve",
				mode: "javascript",
			},
		},
		{
			name: "@hey-api/schemas",
			type: "form",
			nameBuilder: "s{{name}}",
			exportFromIndex: true,
		},
		{
			name: "@hey-api/sdk",
			validator: true,
			exportFromIndex: true,
		},
	],
});
