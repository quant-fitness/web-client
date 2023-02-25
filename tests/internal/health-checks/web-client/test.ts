import { expect, test } from '@playwright/test';

test('web client health check endpoint responds with ok', async ({ request }) => {
	const response = await request.get('/internal/health-checks/web-client');
	expect(response.ok).toBeTruthy();
});

test('web client health check endpoint responds with {"data":"pong"}', async ({ request }) => {
	const response = await request.get('/internal/health-checks/web-client');
	const body = await response.json();
	expect(body).toEqual({ data: 'pong' });
});
