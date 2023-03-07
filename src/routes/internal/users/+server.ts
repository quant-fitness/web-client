import { json, type RequestHandler } from '@sveltejs/kit';
import {
	createUser,
	isErrorResponseBody,
	type CreateUserResponse
} from '$lib/server/internal/users/create-user';
import { listUsers, type ListUsersResponse } from '$lib/server/internal/users/list-users';

export const GET: RequestHandler = async ({ fetch }) => {
	const listUsersResponse: ListUsersResponse = await listUsers({ fetch });

	const status = isErrorResponseBody(listUsersResponse) ? listUsersResponse.status : 200;

	return json(listUsersResponse, { status });
};

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { user } = await request.json();
	const createUserResponse: CreateUserResponse = await createUser({ fetch }, user);

	const status = isErrorResponseBody(createUserResponse) ? createUserResponse.status : 201;

	return json(createUserResponse, { status });
};
