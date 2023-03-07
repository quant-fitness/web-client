import { describe, it, expect, vi } from 'vitest';
import {
	listUsers,
	type ListUsersResponse,
	type ApiErrorResponse,
	type ApiSuccessResponse,
	type User
} from './list-users';

describe('listUsers', () => {
	describe('when the backend does not respond', () => {
		let response: ListUsersResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.reject());
			response = await listUsers({ fetch });
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
		let response: ListUsersResponse;

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
			response = await listUsers({ fetch });
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
			let response: ListUsersResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, status: 201, json: () => Promise.reject() })
				);
				response = await listUsers({ fetch });
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

		describe('when the response is not a valid user', () => {
			let response: ListUsersResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
				response = await listUsers({ fetch });
			});

			it('returns an error object', () => {
				expect(response).toEqual({
					status: 500,
					errors: [
						{
							title: 'response does not include a user',
							detail: 'The response from the API did not contain a user',
							source: {
								pointer: '/response/body'
							}
						}
					]
				});
			});
		});

		describe('when the response is a valid user', () => {
			const createUserResponse: ApiSuccessResponse<User[]> = {
				data: [
					{
						id: 'id',
						emailAddress: 'email@address.org',
						createdAt: new Date().toString(),
						updatedAt: new Date().toString()
					}
				]
			};
			let response: ListUsersResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, json: () => Promise.resolve(createUserResponse) })
				);
				response = await listUsers({ fetch });
			});

			it('returns the user', () => {
				expect(response).toEqual(createUserResponse);
			});
		});
	});
});
