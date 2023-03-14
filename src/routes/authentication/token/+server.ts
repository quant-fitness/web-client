import {
	createAccessToken,
	isErrorResponseBody,
	type CreateAccessTokenResponse
} from '$lib/server/authentication/create-access-token';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
	const { code } = await request.json();
	const createAccessTokenResponse: CreateAccessTokenResponse = await createAccessToken(
		{ fetch },
		{ code }
	);

	if (isErrorResponseBody(createAccessTokenResponse)) {
		return json(createAccessTokenResponse, { status: createAccessTokenResponse.status });
	}

	cookies.set('current-authentication-token', JSON.stringify(createAccessTokenResponse));
	return json({ data: null }, { status: 201 });
};
