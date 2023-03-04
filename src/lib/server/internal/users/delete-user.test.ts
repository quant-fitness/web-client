import {
	deleteUser,
	type ApiSuccessResponse,
	type User,
	type ApiErrorResponse,
	type DeleteUserResponse
} from './delete-user';

import { describe, it, expect, vi } from 'vitest';
describe('deleteUser', () => {
	describe('when the backend does not respond', () => {
		let response: DeleteUserResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.reject());
			response = await deleteUser({ fetch }, 'userid');
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

	describe('when the response is a 404', () => {
		describe('when the response is a valid error object', () => {
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const errorResponse: ApiErrorResponse = {
					status: 404,
					errors: [
						{
							detail: 'whoops',
							title: 'some error',
							source: { pointer: '/whatever/yay' }
						}
					]
				};

				const fetch = vi.fn(() =>
					Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve(errorResponse) })
				);
				response = await deleteUser({ fetch }, 'userid');
			});

			it('returns an error object', () => {
				expect(response).toEqual({
					status: 404,
					errors: [
						{
							detail: 'whoops',
							title: 'some error',
							source: { pointer: '/whatever/yay' }
						}
					]
				});
			});
		});

		describe('when the response is not valid JSON', () => {
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: false, status: 404, json: () => Promise.reject() })
				);
				response = await deleteUser({ fetch }, 'userid');
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

		describe('when the response is not a valid error object', () => {
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) })
				);
				response = await deleteUser({ fetch }, 'userid');
			});

			it('returns an error object', () => {
				expect(response).toEqual({
					status: 500,
					errors: [
						{
							title: 'response does not include errors',
							detail: 'The response from the API was an error but did not contain errors',
							source: {
								pointer: '/response/body'
							}
						}
					]
				});
			});
		});
	});

	describe('when the response is an error other than 404', () => {
		let response: DeleteUserResponse;

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
			response = await deleteUser({ fetch }, 'userid');
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
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, status: 201, json: () => Promise.reject() })
				);
				response = await deleteUser({ fetch }, 'userid');
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
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
				response = await deleteUser({ fetch }, 'userid');
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
			const deleteUserResponse: ApiSuccessResponse<User> = {
				data: {
					id: 'id',
					emailAddress: 'email@address.org',
					createdAt: new Date().toString(),
					updatedAt: new Date().toString()
				}
			};
			let response: DeleteUserResponse;

			beforeEach(async () => {
				const fetch = vi.fn(() =>
					Promise.resolve({ ok: true, json: () => Promise.resolve(deleteUserResponse) })
				);
				response = await deleteUser({ fetch }, 'userid');
			});

			it('returns the user', () => {
				expect(response).toEqual(deleteUserResponse);
			});
		});
	});
});
