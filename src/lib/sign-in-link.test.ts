import Page from './sign-in-link.svelte';
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom';

vi.mock('$env/static/public', () => ({
	PUBLIC_API_BASE_URL: 'PUBLIC_API_BASE_URL',
	PUBLIC_OAUTH_APPLICATION_ID: 'PUBLIC_OAUTH_APPLICATION_ID',
	PUBLIC_OAUTH_REDIRECT_URI: 'PUBLIC_OAUTH_REDIRECT_URI'
}));

it('has the correct href attribute', () => {
	const expectedHREF =
		'PUBLIC_API_BASE_URL/oauth/authorize?client_id=PUBLIC_OAUTH_APPLICATION_ID&redirect_uri=PUBLIC_OAUTH_REDIRECT_URI&response_type=code';
	render(Page);
	expect(screen.getByRole('link')).toHaveAttribute('href', expectedHREF);
});
