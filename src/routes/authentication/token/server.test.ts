import { describe, it, expect, vi, type Mock } from 'vitest';
import { POST } from './+server';
import {
	createAccessToken,
	isErrorResponseBody,
	type ApiErrorResponse,
	type CreateAccessTokenResponse
} from '$lib/server/authentication/create-access-token';

vi.mock('$lib/server/authentication/create-access-token');

const createAccessTokenMock = createAccessToken as unknown as Mock;
const isErrorResponseBodyMock = isErrorResponseBody as unknown as Mock;

describe('POST', () => {
	const fetch = vi.fn();

	describe('when the backend responds with an error', () => {
		let response: Response;
		let apiResponseBody: ApiErrorResponse;
		let setCookie: Mock;

		beforeEach(async () => {
			apiResponseBody = {
				status: 500,
				errors: []
			};
			const request = new Request('http://localhost', {
				method: 'POST',
				body: JSON.stringify({ code: 'code' })
			});
			createAccessTokenMock.mockResolvedValue(apiResponseBody);
			isErrorResponseBodyMock.mockReturnValue(true);

			setCookie = vi.fn();
			const args = { fetch, request, cookies: { set: setCookie } } as any;
			response = await POST(args);
		});

		it('responds with the appropriate error code', () => {
			expect(response.status).toBe(500);
		});

		it('responds with the appropriate error body', async () => {
			const body = await response.json();
			expect(body).toEqual(apiResponseBody);
		});

		it('does not set a cookie', () => {
			expect(setCookie).not.toHaveBeenCalled();
		});
	});

	describe('when the backend responds with a token', () => {
		let response: Response;
		let setCookie: Mock;
		let apiResponseBody: CreateAccessTokenResponse;

		beforeEach(async () => {
			apiResponseBody = { token: 'whatever' };
			const request = new Request('http://localhost', {
				method: 'POST',
				body: JSON.stringify({ code: 'code' })
			});
			createAccessTokenMock.mockResolvedValue(apiResponseBody);
			isErrorResponseBodyMock.mockReturnValue(false);

			setCookie = vi.fn();
			const args = { fetch, request, cookies: { set: setCookie } } as any;
			response = await POST(args);
		});

		it('responds with ok', () => {
			expect(response.ok).toBeTruthy();
		});

		it('sets a cookie', () => {
			expect(setCookie).toHaveBeenCalledWith(
				'current-authentication-token',
				JSON.stringify(apiResponseBody)
			);
		});
	});
});
