import {
	deleteUser,
	type ApiErrorResponse,
	type DeleteUserResponse,
	isErrorResponseBody
} from '$lib/server/internal/users/delete-user';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { DELETE } from './+server';

vi.mock('$lib/server/internal/users/delete-user');

const deleteUserMock = deleteUser as unknown as Mock;
const isErrorResponseBodyMock = isErrorResponseBody as unknown as Mock;
const params = { id: 'userid' };

describe('DELETE', () => {
	const fetch = vi.fn();

	describe('when the backend responds with an error', () => {
		let response: Response;
		let apiResponseBody: ApiErrorResponse;

		beforeEach(async () => {
			apiResponseBody = {
				status: 500,
				errors: []
			};
			deleteUserMock.mockResolvedValue(apiResponseBody);
			isErrorResponseBodyMock.mockReturnValue(true);

			const args = { fetch, params } as any;
			response = await DELETE(args);
		});

		it('responds with the appropriate error code', () => {
			expect(response.status).toBe(500);
		});

		it('responds with the appropriate error body', async () => {
			const body = await response.json();
			expect(body).toEqual(apiResponseBody);
		});
	});

	describe('when the backend responds with the user', () => {
		let response: Response;
		let apiResponseBody: DeleteUserResponse;

		beforeEach(async () => {
			apiResponseBody = {
				data: {
					id: 'id',
					emailAddress: 'email@address.net',
					createdAt: new Date().toString(),
					updatedAt: new Date().toString()
				}
			};
			deleteUserMock.mockResolvedValue(apiResponseBody);

			const args = { fetch, params } as any;
			response = await DELETE(args);
		});

		it('responds with ok', () => {
			expect(response.ok).toBeTruthy();
		});

		it('responds with the user', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual(apiResponseBody);
		});
	});
});
