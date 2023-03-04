import { json, type RequestHandler } from '@sveltejs/kit';
import {
	createUser,
	isErrorResponseBody,
	type CreateUserResponse
} from '$lib/server/internal/users/create-user';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { user } = await request.json();
	const createUserResponse: CreateUserResponse = await createUser({ fetch }, user);

	const status = isErrorResponseBody(createUserResponse) ? createUserResponse.status : 201;

	return json(createUserResponse, { status });
};
