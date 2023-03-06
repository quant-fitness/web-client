import Page from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('/sign-in', () => {
	it('shows a heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument();
	});

	it('links to the registration page', () => {
		render(Page);
		expect(screen.getByRole('link', { name: 'register for an account' })).toHaveAttribute(
			'href',
			'/register'
		);
	});
});
