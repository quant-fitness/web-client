import Page from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('/internal', () => {
	it('shows a heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: 'Internal' })).toBeInTheDocument();
	});

	it('links to the health checks page', () => {
		render(Page);
		expect(screen.getByRole('link', { name: 'Health Checks' })).toHaveAttribute(
			'href',
			'/internal/health-checks'
		);
	});
});
