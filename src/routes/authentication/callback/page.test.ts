import Page from './+page.svelte';
import { beforeEach, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('/authentication/callback', () => {
	beforeEach(() => {
		render(Page);
	});

	it('shows a heading', () => {
		expect(screen.getByRole('heading')).toHaveTextContent('Signing in failed');
	});

	it('shows a link to the sign in page', () => {
		expect(screen.getByRole('link', { name: 'Try Again' })).toBeInTheDocument();
	});

	it('shows a link to the landing page', () => {
		expect(screen.getByRole('link', { name: 'Go back home' })).toBeInTheDocument();
	});
});
