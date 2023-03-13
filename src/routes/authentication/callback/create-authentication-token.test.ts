import { it, expect, vi } from 'vitest';
import { createAuthenticationToken } from './create-authentication-token';

it('sends a request to the backend', () => {
	const fetch = vi.fn();
	const code = 'code';
	createAuthenticationToken({ fetch }, code);
	expect(fetch).toHaveBeenCalledWith('/authentication/token', {
		body: JSON.stringify({ code: 'code' }),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});
});

it('returns the response from the backend', async () => {
	const expectedResponse: Response = new Response();
	const fetch = vi.fn();
	const code = 'code';
	fetch.mockResolvedValue(expectedResponse);

	const response = await createAuthenticationToken({ fetch }, code);
	expect(response).toBe(expectedResponse);
});
