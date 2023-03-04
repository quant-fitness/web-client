import { fetchHealthChecks } from './fetch-health-checks';
import type { HealthCheckResponse } from '$lib/health-check-response';
import { describe, it, expect, vi } from 'vitest';

describe('fetchHealthChecks', () => {
	describe('when the web client is responding as expected', () => {
		let result: HealthCheckResponse;

		beforeEach(async () => {
			const response = { data: 'pong' };
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve(response) })
			);
			result = await fetchHealthChecks({ fetch });
		});

		it('returns .webClientCheck: "responded-as-expected"', () => {
			expect(result.webClientCheck).toBe('responded-as-expected');
		});

		it('returns .apiCheck: "skipped"', () => {
			expect(result.apiCheck).toBe('skipped');
		});

		it('returns .databaseCheck: "skipped"', () => {
			expect(result.databaseCheck).toBe('skipped');
		});
	});

	describe('when the web client is not responding', () => {
		let result: HealthCheckResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.reject());
			result = await fetchHealthChecks({ fetch });
		});

		it('returns .webClientCheck: "failed-to-respond"', () => {
			expect(result.webClientCheck).toBe('failed-to-respond');
		});

		it('returns .apiCheck: "skipped"', () => {
			expect(result.apiCheck).toBe('skipped');
		});

		it('returns .databaseCheck: "skipped"', () => {
			expect(result.databaseCheck).toBe('skipped');
		});
	});

	describe('when the web client response is not ok', () => {
		let result: HealthCheckResponse;

		beforeEach(async () => {
			const response = { data: 'pong' };
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: false, json: () => Promise.resolve(response) })
			);
			result = await fetchHealthChecks({ fetch });
		});

		it('returns .webClientCheck: "responded-with-an-error"', () => {
			expect(result.webClientCheck).toBe('responded-with-an-error');
		});

		it('returns .apiCheck: "skipped"', () => {
			expect(result.apiCheck).toBe('skipped');
		});

		it('returns .databaseCheck: "skipped"', () => {
			expect(result.databaseCheck).toBe('skipped');
		});
	});

	describe('when the web client is responding but not with JSON', () => {
		let result: HealthCheckResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.reject() }));
			result = await fetchHealthChecks({ fetch });
		});

		it('returns .webClientCheck: "responded-with-invalid-json"', () => {
			expect(result.webClientCheck).toBe('responded-with-invalid-json');
		});

		it('returns .apiCheck: "skipped"', () => {
			expect(result.apiCheck).toBe('skipped');
		});

		it('returns .databaseCheck: "skipped"', () => {
			expect(result.databaseCheck).toBe('skipped');
		});
	});

	describe('when the web client is responding but not with the expected JSON', () => {
		let result: HealthCheckResponse;

		beforeEach(async () => {
			const fetch = vi.fn(() =>
				Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 'wut' }) })
			);
			result = await fetchHealthChecks({ fetch });
		});

		it('returns .webClientCheck: "responded-unexpectedly"', () => {
			expect(result.webClientCheck).toBe('responded-unexpectedly');
		});

		it('returns .apiCheck: "skipped"', () => {
			expect(result.apiCheck).toBe('skipped');
		});

		it('returns .databaseCheck: "skipped"', () => {
			expect(result.databaseCheck).toBe('skipped');
		});
	});
});
