import { expect, test } from '@playwright/test';

test('api health check responds with ok', async ({ request }) => {
	const response = await request.get('/internal/health-checks/api');
	expect(response.ok).toBeTruthy();
});

test('api health check responds with {data: "responded-as-expected"}', async ({ request }) => {
	const response = await request.get('/internal/health-checks/api');
	const body = await response.json();
	expect(body).toEqual({ data: 'responded-as-expected' });
});
