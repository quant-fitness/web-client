import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/internal');
	await expect(page.getByRole('heading', { name: 'Internal' })).toBeVisible();
});

test('index page links to the health checks page', async ({ page }) => {
	await page.goto('/internal');
	await page.getByRole('link', { name: 'Health Checks' }).click();
	await page.getByText('Internal - Health Checks').isVisible();
	await expect(page.getByText('Internal - Health Checks')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Health Checks' })).not.toBeVisible();
});
