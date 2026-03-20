export type tSuccessResponse<TResponse> = Extract<
	TResponse,
	{
		success: true;
	}
>;

export type tErrorResponse<TResponse> = Extract<
	TResponse,
	{
		success: false;
	}
>;

export const withSuccess = <
	TResponse extends {
		success: boolean;
	},
>(
	response: TResponse,
) => {
	if (response.success) {
		return response as tSuccessResponse<TResponse>;
	}

	throw response as tErrorResponse<TResponse>;
};
