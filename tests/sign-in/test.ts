import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/sign-in');
	await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});
