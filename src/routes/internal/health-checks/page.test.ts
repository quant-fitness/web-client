import Page from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import type { HealthCheckResponse } from '$lib/health-check-response';
import '@testing-library/jest-dom';

describe('/internal/health-checks', () => {
	it('shows a heading', () => {
		render(Page, {
			data: {
				webClientCheck: 'responded-as-expected',
				apiCheck: 'responded-as-expected',
				databaseCheck: 'responded-as-expected'
			}
		});
		expect(screen.getByRole('heading', { name: 'Internal - Health Checks' })).toBeInTheDocument();
	});

	describe('webClientHealth', () => {
		test.each([
			{
				webClientCheck: 'responded-as-expected',
				expected: 'The web client is responding as expected'
			},
			{ webClientCheck: 'failed-to-respond', expected: 'The web client failed to respond' },
			{
				webClientCheck: 'responded-with-an-error',
				expected: 'The web client responded with an error'
			},
			{
				webClientCheck: 'responded-with-invalid-json',
				expected: 'The web client responded with invalid JSON'
			},
			{
				webClientCheck: 'responded-unexpectedly',
				expected: 'The web client responded unexpectedly'
			}
		])('displays $expected with status $webClientCheck', ({ webClientCheck, expected }) => {
			const data: HealthCheckResponse = { webClientCheck } as HealthCheckResponse;
			render(Page, { data });
			expect(screen.getByText(expected)).toBeInTheDocument();
		});
	});
});
