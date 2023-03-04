import { fetchApiHealth } from './fetch-api-health';
import { describe, it, expect, vi } from 'vitest';

describe('fetchApiHealth', () => {
	describe('when the api is responding as expected', () => {
		it('returns "responded-as-expected"', async () => {
			const response = { data: 'pong' };
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(response) })
			);
			const result = await fetchApiHealth({ fetch });
			expect(result).toBe('responded-as-expected');
		});
	});

	describe('when the api is not responding', () => {
		it('returns "failed-to-respond"', async () => {
			const fetch = vi.fn(() => Promise.reject());
			const result = await fetchApiHealth({ fetch });
			expect(result).toBe('failed-to-respond');
		});
	});

	describe('when the api response is not ok', () => {
		it('returns "responded-with-an-error"', async () => {
			const fetch = vi.fn(() => Promise.resolve({ ok: false }));
			const result = await fetchApiHealth({ fetch });
			expect(result).toBe('responded-with-an-error');
		});
	});

	describe('when the api is responding but not with JSON', () => {
		it('returns "responded-with-invalid-json"', async () => {
			const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.reject() }));
			const result = await fetchApiHealth({ fetch });
			expect(result).toBe('responded-with-invalid-json');
		});
	});

	describe('when the api is responding but not with the expected JSON', () => {
		it('returns "responded-unexpectedly"', async () => {
			const response = { data: 'poing' };
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(response) })
			);
			const result = await fetchApiHealth({ fetch });
			expect(result).toBe('responded-unexpectedly');
		});
	});
});
