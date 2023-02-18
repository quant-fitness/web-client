import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/internal');
	await expect(page.getByRole('heading', { name: 'Internal' })).toBeVisible();
});
