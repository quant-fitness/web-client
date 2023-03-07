import { describe, it, expect, vi, type Mock } from 'vitest';
import { POST, GET } from './+server';
import {
	isErrorResponseBody,
	createUser,
	type ApiErrorResponse,
	type CreateUserResponse
} from '$lib/server/internal/users/create-user';
import { listUsers, type ListUsersResponse } from '$lib/server/internal/users/list-users';

vi.mock('$lib/server/internal/users/create-user');
vi.mock('$lib/server/internal/users/list-users');

const createUserMock = createUser as unknown as Mock;
const listUsersMock = listUsers as unknown as Mock;
const isErrorResponseBodyMock = isErrorResponseBody as unknown as Mock;

describe('GET', () => {
	const fetch = vi.fn();

	describe('when the backend responds with an error', () => {
		let response: Response;
		let apiResponseBody: ApiErrorResponse;

		beforeEach(async () => {
			apiResponseBody = {
				status: 500,
				errors: []
			};
			listUsersMock.mockResolvedValue(apiResponseBody);
			isErrorResponseBodyMock.mockReturnValue(true);

			const args = { fetch } as any;
			response = await GET(args);
		});

		it('responds with the appropriate error code', () => {
			expect(response.status).toBe(500);
		});

		it('responds with the appropriate error body', async () => {
			const body = await response.json();
			expect(body).toEqual(apiResponseBody);
		});
	});

	describe('when the backend responds with users', () => {
		let response: Response;
		let apiResponseBody: ListUsersResponse;

		beforeEach(async () => {
			apiResponseBody = {
				data: [
					{
						id: 'id',
						emailAddress: 'email@address.net',
						createdAt: new Date().toString(),
						updatedAt: new Date().toString()
					}
				]
			};
			listUsersMock.mockResolvedValue(apiResponseBody);

			const args = { fetch } as any;
			response = await GET(args);
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

describe('POST', () => {
	const fetch = vi.fn();

	describe('when the backend responds with an error', () => {
		let response: Response;
		let apiResponseBody: ApiErrorResponse;

		beforeEach(async () => {
			apiResponseBody = {
				status: 500,
				errors: []
			};
			const request = new Request('http://localhost', {
				method: 'POST',
				body: JSON.stringify({ user: { emailAddress: 'email@address.net' } })
			});
			createUserMock.mockResolvedValue(apiResponseBody);
			isErrorResponseBodyMock.mockReturnValue(true);

			const args = { fetch, request } as any;
			response = await POST(args);
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
		let apiResponseBody: CreateUserResponse;

		beforeEach(async () => {
			apiResponseBody = {
				data: {
					id: 'id',
					emailAddress: 'email@address.net',
					createdAt: new Date().toString(),
					updatedAt: new Date().toString()
				}
			};
			const request = new Request('http://localhost', {
				method: 'POST',
				body: JSON.stringify({ user: { emailAddress: 'email@address.net' } })
			});
			createUserMock.mockResolvedValue(apiResponseBody);

			const args = { fetch, request } as any;
			response = await POST(args);
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
