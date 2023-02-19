import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/internal/health-checks');
	await expect(page.getByRole('heading', { name: 'Internal - Health Checks' })).toBeVisible();
});

test('index page shows that the web client is responding as expected', async ({ page }) => {
	await page.goto('/internal/health-checks');
	await expect(page.getByText('The web client is responding as expected')).toBeVisible();
});
