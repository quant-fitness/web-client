import { describe, it, expect, vi } from 'vitest';
import { GET } from './+server';

describe('GET', () => {
	describe('when the api is responding as expected', () => {
		let response: Response;

		beforeEach(async () => {
			const apiResponse = { data: 'pong' };
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(apiResponse) })
			);
			response = await GET({ fetch } as any);
		});

		it('returns ok', async () => {
			expect(response.ok).toBeTruthy();
		});

		it('returns "responded-as-expected"', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual({ data: 'responded-as-expected' });
		});
	});

	describe('when the api is not responding', () => {
		let response: Response;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.reject());
			response = await GET({ fetch } as any);
		});

		it('returns ok', async () => {
			expect(response.ok).toBeTruthy();
		});

		it('returns "failed-to-respond"', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual({ data: 'failed-to-respond' });
		});
	});

	describe('when the api response is not ok', () => {
		let response: Response;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }));
			response = await GET({ fetch } as any);
		});

		it('returns ok', async () => {
			expect(response.ok).toBeTruthy();
		});

		it('returns "responded-with-an-error"', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual({ data: 'responded-with-an-error' });
		});
	});

	describe('when the api is responding but not with JSON', () => {
		let response: Response;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.reject({}) }));
			response = await GET({ fetch } as any);
		});

		it('returns ok', async () => {
			expect(response.ok).toBeTruthy();
		});

		it('returns "responded-with-invalid-json"', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual({ data: 'responded-with-invalid-json' });
		});
	});

	describe('when the api is responding but not with the expected JSON', () => {
		let response: Response;

		beforeEach(async () => {
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 'poing' }) })
			);
			response = await GET({ fetch } as any);
		});

		it('returns ok', async () => {
			expect(response.ok).toBeTruthy();
		});

		it('returns "responded-unexpectedly"', async () => {
			const responseBody = await response.json();
			expect(responseBody).toEqual({ data: 'responded-unexpectedly' });
		});
	});
});
