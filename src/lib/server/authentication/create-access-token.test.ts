import {
	createAccessToken,
	type CreateAccessTokenPayload,
	type ApiErrorResponse,
	type CreateAccessTokenResponse
} from './create-access-token';
import { describe, it, expect, vi } from 'vitest';

describe('createAccessToken', () => {
	describe('when the backend does not respond', () => {
		let response: CreateAccessTokenResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.reject());
			const payload = { code: 'code' };
			response = await createAccessToken({ fetch }, payload);
		});

		it('responds with an error', () => {
			expect(response).toEqual({
				status: 502,
				errors: [
					{
						title: 'request failed',
						detail: 'the API did not respond',
						source: { pointer: '/response' }
					}
				]
			});
		});
	});

	describe('when the response is an error', () => {
		let response: CreateAccessTokenResponse;
		const payload: CreateAccessTokenPayload = { code: 'code' };

		beforeEach(async () => {
			const errorResponse: ApiErrorResponse = {
				status: 500,
				errors: [
					{
						title: 'some error',
						detail: 'some error',
						source: { pointer: '/whatever/yay' }
					}
				]
			};

			const fetch = vi.fn(() =>
				Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve(errorResponse) })
			);
			response = await createAccessToken({ fetch }, payload);
		});

		it('returns an error object', () => {
			expect(response).toEqual({
				status: 500,
				errors: [
					{
						title: 'server error',
						detail: 'Something unexpected happened',
						source: { pointer: '/response' }
					}
				]
			});
		});
	});

	describe('when the response is ok', () => {
		describe('when the response is not valid JSON', () => {
			let response: CreateAccessTokenResponse;
			const payload: CreateAccessTokenPayload = { code: 'code' };

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, status: 201, json: () => Promise.reject() })
				);
				response = await createAccessToken({ fetch }, payload);
			});

			it('returns an error object', () => {
				expect(response).toEqual({
					status: 500,
					errors: [
						{
							title: 'response is not JSON',
							detail: 'response is not JSON',
							source: {
								pointer: '/response/body'
							}
						}
					]
				});
			});
		});

		describe('when the response is not a valid token', () => {
			let response: CreateAccessTokenResponse;
			let payload: CreateAccessTokenPayload;

			beforeEach(async () => {
				payload = { code: 'code' };
				const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
				response = await createAccessToken({ fetch }, payload);
			});

			it('returns an error object', () => {
				expect(response).toEqual({
					status: 500,
					errors: [
						{
							title: 'response does not include a token',
							detail: 'The response from the API did not contain a token',
							source: {
								pointer: '/response/body'
							}
						}
					]
				});
			});
		});

		describe('when the response is a valid token', () => {
			const createAccessTokenReponse: any = {
				access_token: 'access_token',
				token_type: 'token_type',
				expires_in: 1234,
				refresh_token: 'refresh_token',
				scope: 'public',
				created_at: 1234
			};
			let response: CreateAccessTokenResponse;
			let payload: CreateAccessTokenPayload;

			beforeEach(async () => {
				payload = { code: 'code' };

				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, json: () => Promise.resolve(createAccessTokenReponse) })
				);
				response = await createAccessToken({ fetch }, payload);
			});

			it('returns the user', () => {
				expect(response).toEqual(createAccessTokenReponse);
			});
		});
	});
});
