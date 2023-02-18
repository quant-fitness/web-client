import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/internal');
	await expect(page.getByRole('heading', { name: 'Internal' })).toBeVisible();
});

test('index page links to the health checks page', async ({ page }) => {
	await page.goto('/internal');
	await page.getByRole('link', { name: 'Health Checks' }).click();
	await expect(page.url()).toMatch(/\/internal\/health-checks$/);
});
