import Page from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

describe('/register', () => {
	it('shows a heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: 'Register for an account' })).toBeInTheDocument();
	});

	it('links to the sign in page', () => {
		render(Page);
		expect(screen.getByRole('link', { name: 'sign in to your account' })).toHaveAttribute(
			'href',
			'/sign-in'
		);
	});
});
