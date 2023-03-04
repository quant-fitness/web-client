import { json, type RequestHandler } from '@sveltejs/kit';
import {
	deleteUser,
	isErrorResponseBody,
	type DeleteUserResponse
} from '$lib/server/internal/users/delete-user';

export const DELETE: RequestHandler = async ({ fetch, params }) => {
	const userId = params.id || '';
	const deleteUserResponse: DeleteUserResponse = await deleteUser({ fetch }, userId);

	const status = isErrorResponseBody(deleteUserResponse) ? deleteUserResponse.status : 201;

	return json(deleteUserResponse, { status });
};
