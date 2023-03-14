import { describe, it, expect, vi, type Mock } from 'vitest';
import { load } from './+page.server';
import { createAuthenticationToken } from './create-authentication-token';
import { redirect } from '@sveltejs/kit';

vi.mock('./create-authentication-token');

const createAuthenticationTokenMock = createAuthenticationToken as Mock;

describe('load', () => {
	it('tries to create an authentication token', () => {
		const fetch = vi.fn();
		const url = new URL('http://localhost:3000?code=code');
		createAuthenticationTokenMock.mockResolvedValue({ ok: false });
		load({ url, fetch } as any);
		expect(createAuthenticationTokenMock).toHaveBeenCalledWith({ fetch }, 'code');
	});

	it('redirects to the landing page when the token is created', async () => {
		const fetch = vi.fn();
		const url = new URL('http://localhost:3000?code=code');
		createAuthenticationTokenMock.mockResolvedValue(new Response());
		const result = load({ url, fetch } as any);
		return expect(result).rejects.toEqual(redirect(302, '/'));
	});

	it('does not redirect to the landing page when the token creation fails', () => {
		const fetch = vi.fn();
		const url = new URL('http://localhost:3000?code=code');
		createAuthenticationTokenMock.mockResolvedValue({ ok: false });
		const result = load({ url, fetch } as any);
		return expect(result).resolves.toBeUndefined();
	});
});
